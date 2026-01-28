"""Test script for Anthropic API call"""
import anthropic

ANTHROPIC_API_KEY = "sk-ant-api03-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc890defABCDEFGH"

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ],
)

print(message.content)
