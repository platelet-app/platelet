export const generateEmailTemplate = (
    recipientName: string,
    serviceName: string,
    serviceURL: string,
    serviceLogo: string,
    plateletLogo: string,
    trackingNumber: string
) => {
    const trackingURL = `https://platelet.app/track?token=${trackingNumber}`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delivery Tracking</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f4f6f8;
      margin: 0;
      padding: 24px;
      color: #1a1a1a;
    }
    .card {
      max-width: 560px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #eee;
    }
    .product-logo img {
      height: 40px;
      width: auto;
      display: block;
    }
    .charity {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .charity img {
      height: 44px;
      width: auto;
      display: block;
    }
    .charity a {
      color: #c0392b;
      font-weight: 600;
      text-decoration: none;
    }
    .charity a:hover {
      text-decoration: underline;
    }
    .body {
      padding: 24px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 12px;
    }
    .message {
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 20px;
    }
    .tracking-number {
      background: #f9fafb;
      border-radius: 8px;
      padding: 16px 20px;
      text-align: center;
      margin-bottom: 16px;
    }
    .tracking-number .label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .tracking-number .value {
      font-size: 22px;
      font-weight: 700;
      font-family: "SF Mono", Menlo, Consolas, monospace;
      letter-spacing: 1px;
    }
    .track-button {
      display: block;
      text-align: center;
      background: #c0392b;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      padding: 14px 20px;
      border-radius: 8px;
    }
    .track-button:hover {
      background: #a93226;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <!-- Software product logo, links to platelet.app -->
      <a class="product-logo" href="https://platelet.app">
        <img src="${plateletLogo}" alt="Platelet logo">
      </a>

      <!-- Charity name + website link, with charity logo beside it -->
      <div class="charity">
        <img src="${serviceLogo}" alt="${serviceName} logo">
        <a href="${serviceURL}" target="_blank" rel="noopener">${serviceName}</a>
      </div>
    </div>

    <div class="body">
      <p class="greeting">Hi ${recipientName},</p>
      <p class="message">
        A delivery is on its way to you, transported by volunteer riders from
        <a href="${serviceURL}" target="_blank" rel="noopener">${serviceName}</a>.
        You can track its progress below.
      </p>

      <div class="tracking-number">
        <span class="label">Tracking Number</span>
        <span class="value">${trackingNumber}</span>
      </div>

      <a class="track-button" href="${trackingURL}" target="_blank" rel="noopener">
        Track this delivery
      </a>
    </div>
  </div>
</body>
</html>
`;
};
