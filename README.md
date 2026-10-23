# Let's get creative: a starter AI agent

A small, readable AI agent built on Claude. You chat with it in your terminal, and it decides when to call tools to answer you.

The Anthropic SDK's tool runner drives the loop: Claude replies, calls tools, reads the results, and repeats until it has an answer.

## What it can do

| Tool | What it does |
|---|---|
| `calculate` | Exact arithmetic (a safe parser, not `eval`) |
| `current_time` | Current date and time in any timezone |
| `list_files` | List files in the agent's workspace |
| `read_file` | Read a text file from the workspace |
| `write_file` | Create or overwrite a file in the workspace |

The file tools can't reach anything outside the `workspace/` folder.

## Setup

Requires Python 3.10+ and an Anthropic API key.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
python -m agent
```

Try asking:

- "What's 17% of 2,340, rounded to the nearest cent?"
- "What time is it in Tokyo right now?"
- "Write a short packing list for a weekend camping trip to packing.md, then read it back."

## Configuration

| Environment variable | Default | Purpose |
|---|---|---|
| `AGENT_MODEL` | `claude-opus-5-5` | Which Claude model to use |
| `AGENT_EFFORT` | `medium` | How hard Claude thinks: `low`, `medium`, `high`, `xhigh` or `max` |
| `AGENT_WORKSPACE` | `./workspace` | The only folder the file tools can access |

If Claude's safety classifiers decline a request, the agent automatically retries it on a fallback model (`fallbacks="default"`). Remove `betas` and `fallbacks` in `agent/main.py` to turn this off.

## Adding your own tool

Write a function in `agent/tools.py`, decorate it with `@beta_tool` and add it to `TOOLS`:

```python
@beta_tool
def get_weather(city: str) -> str:
    """Get the current weather for a city.

    Args:
        city: City name, e.g. "Paris".
    """
    return call_your_weather_api(city)
```

The SDK builds the tool's schema from the type hints and docstring, so write the docstring for Claude: say what the tool does and when to use it. Raise `ToolError("...")` when something goes wrong; Claude sees the message and can try again.

## Project layout

```
agent/
  main.py    # chat loop: talks to Claude and runs the tool runner
  tools.py   # tool definitions
tests/
  test_tools.py  # unit tests for each tool
  test_loop.py   # runs one full agent turn against a fake API (no key needed)
```

## Running tests

```bash
pip install -r requirements-dev.txt
python -m pytest
```
