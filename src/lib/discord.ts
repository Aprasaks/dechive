interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  timestamp?: string;
}

export async function sendDiscordWebhook(url: string, embed: DiscordEmbed): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!res.ok) {
    throw new Error(`Discord webhook failed: ${res.status} ${res.statusText}`);
  }
}

export async function sendErrorAlert(message: string, detail?: string): Promise<void> {
  const webhookUrl = process.env.DISCORD_ERROR_WEBHOOK_URL;
  if (!webhookUrl) return;

  await sendDiscordWebhook(webhookUrl, {
    title: '🚨 Dechive 에러 발생',
    description: detail ? `**${message}**\n\`\`\`${detail}\`\`\`` : `**${message}**`,
    color: 0xe74c3c,
    timestamp: new Date().toISOString(),
  });
}
