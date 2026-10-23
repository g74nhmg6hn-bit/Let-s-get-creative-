"""Drive one agent turn against a fake Messages API to check the loop wiring."""

import json

import anthropic
import httpx2 as httpx

from agent import main


def _response(content, stop_reason):
    return {
        "id": "msg_test", "type": "message", "role": "assistant", "model": main.MODEL,
        "content": content, "stop_reason": stop_reason, "stop_sequence": None,
        "usage": {"input_tokens": 1, "output_tokens": 1},
    }


def test_turn_runs_tool_and_records_history(capsys):
    requests = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        requests.append((request.headers, body))
        if len(requests) == 1:
            return httpx.Response(200, json=_response(
                [{"type": "tool_use", "id": "tu_1", "name": "calculate", "input": {"expression": "6 * 7"}}],
                "tool_use",
            ))
        return httpx.Response(200, json=_response([{"type": "text", "text": "It's 42."}], "end_turn"))

    client = anthropic.Anthropic(api_key="test", http_client=httpx.Client(transport=httpx.MockTransport(handler)))
    messages = [{"role": "user", "content": "What is 6 * 7?"}]
    main.run_turn(client, messages)

    headers, first = requests[0]
    assert first["model"] == "claude-opus-5-5"
    assert first["fallbacks"] == "default"
    assert first["output_config"] == {"effort": "medium"}
    assert "server-side-fallback-2026-07-01" in headers["anthropic-beta"]
    assert {t["name"] for t in first["tools"]} >= {"calculate", "write_file"}

    _, second = requests[1]
    tool_result = second["messages"][-1]["content"][0]
    assert tool_result["tool_use_id"] == "tu_1"
    assert "42" in json.dumps(tool_result["content"])
    assert not tool_result.get("is_error")

    assert [m["role"] for m in messages] == ["user", "assistant", "user", "assistant"]
    assert "It's 42." in capsys.readouterr().out
