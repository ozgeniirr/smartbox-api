

export const generateVerificationEmailHtml = (fullName: string, tokenUrl: string) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F7FA;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <img src="https://rct.e-rct.com.tr/assets/logo.20bfba02.png" alt="Logo" width="196" style="display: block; margin: 0 auto;">
            </td>
        </tr>
        <tr>
            <td bgcolor="#FFFFFF" style="padding: 40px 30px; border-radius: 5px;">
                <h2 style="margin-bottom: 20px; font-size: 20px; color: #5E6063;">Merhaba ${fullName},</h2>
                <p style="font-size: 18px; font-weight: bold; color: #252930;">E-postanızı doğrulamak için aşağıdaki bağlantıya tıklayabilirsiniz:</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="border: 1px solid #DFD9D9; padding: 16px; background-color: #FFFFFF;">
                            <a href="
                                ${tokenUrl}
                            "
                                target="_blank" rel="noopener noreferrer"
                                style="display: block; text-decoration: none; text-align: center; background-color: #3B82F6; color: #fff; border-radius: 4px; padding: 16px; font-size: 18px; font-weight: 500;">Onayla</a>
                        </td>
                    </tr>
                </table>
                <p style="font-weight: normal; margin-top: 10px; color: #797B7F;">Bu talebi siz başlatmadıysanız, lütfen
                    hemen bizimle iletişime geçin <a href="mailto:support@bestnet.com.tr"
                        style="color: #3B82F6;">support@bestnet.com.tr</a>.</p>
                <p style="color: #797B7F; margin-top: 20px; margin-bottom: 10px;">Saygılarımızla,</p>
                <p>E-RCT Ekibi</p>
            </td>
        </tr>
        <tr>
                <td align="center" bgcolor="#FFFFFF" style="padding: 20px;">
                    <img src="https://rct.e-rct.com.tr/assets/logo.20bfba02.png" alt="Logo" width="144" style="display: block; margin: 0 auto;">
                    <p style="margin-top: 20px; font-size: 14px; color: #797B7F; line-height: 1.5;">
                        Bestnet Greensoft Teknoloji Ltd. Şti
                    </p>
                    <p style="margin-top: 20px; font-size: 14px; color: #797B7F; line-height: 1.5;">
                        Pınarbaşı Mah. Hürriyet Cad. Akdeniz Üniversitesi Antalya Teknokent AR-GE 1 Binası No: 3B/106 Konyaaltı/Antalya
                    </p>
                </td>
            </tr>
    </table>
</body>
</html>
  
  `;
};
