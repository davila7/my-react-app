#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.parse
import sys
from datetime import datetime

def main():
    webhook_url = os.getenv('DISCORD_WEBHOOK_URL')
    if not webhook_url:
        print("No Discord webhook configured")
        exit(0)

    # Read hook data from stdin (Claude Code passes data this way)
    try:
        hook_data = json.load(sys.stdin)
        hook_event = hook_data.get('hook_event_name', 'Unknown')
        tool_name = hook_data.get('tool_name', 'Unknown Tool')

        # Extract file path or command for context
        tool_input = hook_data.get('tool_input', {})
        file_path = tool_input.get('file_path', '')
        command = tool_input.get('command', '')

        # Determine agent name (Claude Code doesn't directly provide this)
        agent_name = os.getenv('AGENT_NAME', 'Claude Code Agent')

        # Create activity description based on tool and input
        if file_path:
            activity_details = file_path
            activity_title = f"{tool_name}: {os.path.basename(file_path)}"
        elif command:
            activity_details = command[:100] + ('...' if len(command) > 100 else '')
            activity_title = f"{tool_name}: {command.split()[0] if command.split() else 'command'}"
        else:
            activity_details = f"Tool: {tool_name}"
            activity_title = f"Used {tool_name}"

    except Exception as e:
        # Fallback to environment variables
        print(f"Debug: Failed to parse stdin JSON: {e}")
        hook_event = os.getenv('HOOK_EVENT', 'PostToolUse')
        tool_name = os.getenv('TOOL_NAME', 'Unknown Tool')
        agent_name = os.getenv('AGENT_NAME', 'Claude Code Agent')
        activity_title = os.getenv('ACTIVITY_TITLE', f'Used {tool_name}')
        activity_details = os.getenv('ACTIVITY_DETAILS', f'Tool: {tool_name}')

    # Get additional activity info from environment (can override defaults)
    activity_title = os.getenv('ACTIVITY_TITLE', activity_title)
    activity_url = os.getenv('ACTIVITY_URL', '#')
    activity_details = os.getenv('ACTIVITY_DETAILS', activity_details)

    # Create Discord embed
    embed = {
        "title": "🤖 Claude Code Activity",
        "description": f"{agent_name} completed a task",
        "color": 0x5865F2,
        "fields": [
            {
                "name": "⚡ Hook Event",
                "value": f"`{hook_event}`",
                "inline": True
            },
            {
                "name": "🤖 Agent",
                "value": f"{agent_name}",
                "inline": True
            },
            {
                "name": "📋 Activity",
                "value": f"[{activity_title}]({activity_url})"
            },
            {
                "name": "📝 Details",
                "value": f"```\n{activity_details}\n```"
            }
        ],
        "timestamp": datetime.utcnow().isoformat()
    }

    # Send to Discord using native urllib
    payload = {
        "embeds": [embed],
        "username": "Claude Code Bot"
    }

    try:
        # Convert payload to JSON and encode
        data = json.dumps(payload).encode('utf-8')

        # Debug: print payload size
        print(f"Debug: Payload size: {len(data)} bytes")

        # Create request with User-Agent header
        req = urllib.request.Request(
            webhook_url,
            data=data,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'Claude-Code-Discord-Bot/1.0'
            }
        )

        # Send request
        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status == 200 or response.status == 204:
                print("✅ Discord notification sent")
            else:
                print(f"❌ Discord API returned status: {response.status}")

    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code} - {e.reason}")
        if hasattr(e, 'read'):
            error_body = e.read().decode('utf-8')
            print(f"Error details: {error_body}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()