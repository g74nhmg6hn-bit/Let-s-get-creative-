import pytest
from anthropic.lib.tools import ToolError

from agent import tools


@pytest.fixture(autouse=True)
def workspace(tmp_path, monkeypatch):
    monkeypatch.setattr(tools, "WORKSPACE", tmp_path)
    return tmp_path


@pytest.mark.parametrize(
    "expr, expected",
    [("2 + 3 * 4", "14"), ("(2 + 3) * 4", "20"), ("2 ** 10", "1024"), ("-7 // 2", "-4"), ("sqrt(16)", "4.0")],
)
def test_calculate(expr, expected):
    assert tools.calculate.call({"expression": expr}) == expected


@pytest.mark.parametrize("expr", ["__import__('os')", "open('x')", "1 / 0", "2 ** 99999", "1 +"])
def test_calculate_rejects(expr):
    with pytest.raises(ToolError):
        tools.calculate.call({"expression": expr})


def test_current_time():
    assert "UTC" in tools.current_time.call({})
    with pytest.raises(ToolError):
        tools.current_time.call({"timezone": "Not/AZone"})


def test_write_read_list(workspace):
    tools.write_file.call({"path": "notes/a.txt", "content": "hello"})
    assert (workspace / "notes" / "a.txt").read_text() == "hello"
    assert tools.read_file.call({"path": "notes/a.txt"}) == "hello"
    assert tools.list_files.call({}) == "notes/"
    assert tools.list_files.call({"directory": "notes"}) == "a.txt"


@pytest.mark.parametrize("path", ["../escape.txt", "/etc/passwd", "a/../../x"])
def test_file_tools_stay_in_workspace(path):
    with pytest.raises(ToolError):
        tools.read_file.call({"path": path})
    with pytest.raises(ToolError):
        tools.write_file.call({"path": path, "content": "x"})


def test_schemas_generated():
    names = {t.name for t in tools.TOOLS}
    assert names == {"calculate", "current_time", "list_files", "read_file", "write_file"}
    assert tools.write_file.to_dict()["input_schema"]["required"] == ["path", "content"]
