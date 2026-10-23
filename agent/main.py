"""Interactive terminal agent built on Claude and the Anthropic SDK tool runner.

Run with:  python -m agent
"""

from __future__ import annotations

import os

import anthropic

from .tools import TOOLS, WORKSPACE

MODEL = os.environ.get("AGENT_MODEL", "claude-opus-5-5")
EFFORT = os.environ.get("AGENT_EFFORT", "medium")  # low | medium | high | xhigh | max

SYSTEM_PROMPT = f"""You are a helpful assistant running in the user's terminal.

You have tools for arithmetic, the current time, and reading and writing files in
a workspace folder ({WORKSPACE}). Use a tool whenever it gives a more reliable
answer than recalling or estimating: use calculate for any non-trivial math, and
read files before describing their contents. Keep answers concise."""


def _print_turn(message) -> None:
    """Show Claude's text and any tool calls from one model response."""
    for block in message.content:
        if block.type == "text" and block.text.strip():
            print(f"\nClaude: {block.text}")
        elif block.type == "tool_use":
            print(f"  [tool] {block.name}({block.input})")
        elif block.type == "fallback":
            print(f"  [fallback] {block.from_.model} declined; {block.to.model} continued")


def run_turn(client: anthropic.Anthropic, messages: list) -> None:
    """Run the agent until it stops calling tools, appending to ``messages``."""
    runner = client.beta.messages.tool_runner(
        model=MODEL,
        max_tokens=16000,
        system=SYSTEM_PROMPT,
        tools=TOOLS,
        messages=messages,
        output_config={"effort": EFFORT},
        # If a safety classifier declines, retry the turn on a fallback model.
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        max_iterations=25,
    )
    for message in runner:
        _print_turn(message)
        # The runner keeps its own copy of the history; mirror it so the next
        # user turn continues the same conversation. Append content unchanged.
        messages.append({"role": "assistant", "content": message.content})
        tool_response = runner.generate_tool_call_response()  # cached; tools run once
        if tool_response is not None:
            messages.append(tool_response)

        if message.stop_reason == "refusal":
            print("\n[Claude declined this request.]")
        elif message.stop_reason == "max_tokens":
            print("\n[Response hit the max_tokens limit and was cut off.]")


def main() -> None:
    WORKSPACE.mkdir(parents=True, exist_ok=True)
    client = anthropic.Anthropic()
    messages: list = []

    print(f"Agent ready ({MODEL}). Workspace: {WORKSPACE}")
    print("Type a message, or 'exit' to quit.")
    while True:
        try:
            user_input = input("\nYou: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if user_input.lower() in {"exit", "quit"}:
            break
        if not user_input:
            continue

        turn_start = len(messages)
        messages.append({"role": "user", "content": user_input})
        try:
            run_turn(client, messages)
        except anthropic.AuthenticationError:
            print("\n[Authentication failed. Set ANTHROPIC_API_KEY and try again.]")
            break
        except anthropic.RateLimitError:
            print("\n[Rate limited. Wait a moment and try again.]")
            del messages[turn_start:]  # roll back so history stays valid
        except anthropic.APIStatusError as exc:
            print(f"\n[API error {exc.status_code}: {exc.message}]")
            del messages[turn_start:]  # roll back so history stays valid
        except anthropic.APIConnectionError:
            print("\n[Could not reach the API. Check your network connection.]")
            del messages[turn_start:]  # roll back so history stays valid


if __name__ == "__main__":
    main()
