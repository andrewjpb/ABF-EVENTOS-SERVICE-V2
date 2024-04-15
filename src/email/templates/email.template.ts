export const EmailTemplate = {
    checkIn: '<h2>TESTE</h2><img src="{{qr-code}}" alt="qr-code">',
    eventSubscriptionHybrid: `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
  </style>
  <![endif]-->
  <title>Confirmamos a sua participação no evento {{event-title}}.</title>
  <style>
    @media (max-width: 600px) {
      .sm-my-8 {
        margin-top: 32px !important;
        margin-bottom: 32px !important
      }
      .sm-px-4 {
        padding-left: 16px !important;
        padding-right: 16px !important
      }
      .sm-px-6 {
        padding-left: 24px !important;
        padding-right: 24px !important
      }
      .sm-leading-8 {
        line-height: 32px !important
      }
    }
  </style>
</head>
<body style="margin: 0; width: 100%; background-color: #f8fafc; padding: 0; -webkit-font-smoothing: antialiased; word-break: break-word">
  <div style="display: none">
    Esse é um evento híbrido, atente-se ao formato (online ou presencial) selecionado no momento da sua inscrição.
    &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
  </div>
  <div role="article" aria-roledescription="email" aria-label="Confirmamos a sua participação no evento undefined." lang="en">
    <div class="sm-px-4" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 552px; max-width: 100%">
            <div class="sm-my-8" style="margin-top: 48px; margin-bottom: 48px; text-align: center">
              <a href="https://eventos.abf.com.br">
                <img src="https://www.abf.com.br/wp-content/uploads/2023/07/nova-logo-abf.png" width="270" alt="Eventos ABF" style="max-width: 100%; vertical-align: middle; line-height: 1; border: 0">
              </a>
            </div>
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-px-6" style="border-radius: 4px; background-color: #fff; padding: 48px; font-size: 16px; color: #334155; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)">
                  <h1 class="sm-leading-8" style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #000">
                    Ola, {{user}}
                  </h1>
                  <p style="margin: 0; line-height: 24px">
                    Confirmamos a sua participação no evento {{event-title}}.
                  </p>
                  <p>
                    Esse é um evento híbrido, atente-se ao formato (online ou
                    presencial) selecionado no momento da sua inscrição.
                  </p>
                  <p><strong>DATA DO EVENTO:</strong> {{event-date}}</p>
                  <p><strong>LOCAL:</strong> {{event-address}}</p>
                  <p><strong>LINK DE TRANSMISSÃO:</strong> {{transmission-link}}</p>
                  <strong style="margin-bottom: 0">IMPORTANTE:</strong>
                  <p style="margin: 0;">
                    1- Esta inscrição é válida exclusivamente para o dia
                    {{event-date}}.
                  </p>
                  <p style="margin: 0;">
                    2- Apresente seu QRCode no dia do evento no credenciamento.
                  </p>
                  <div role="separator" style="line-height: 24px">&zwj;</div>
                  <div>
                    <a href="{{schedule_link}}" style="display: inline-block; border-radius: 4px; background-color: #00539a; padding: 16px 24px; font-size: 16px; font-weight: 600; line-height: 1; color: #f8fafc; text-decoration: none">
                      <!--[if mso]>
      <i style="mso-font-width: -100%; letter-spacing: 32px; mso-text-raise: 30px" hidden>&nbsp;</i>
    <![endif]-->
                      <span style="mso-text-raise: 16px">
                  Adicione o evento na sua agenda! &rarr;
                </span>
                      <!--[if mso]>
      <i style="mso-font-width: -100%; letter-spacing: 32px;" hidden>&nbsp;</i>
    <![endif]-->
                    </a>
                  </div>

                  
              {{text-patrocinador}}

                 {{container-patrocidadores}}
                    <div
                      role="separator"
                      style="
                        background-color: #e2e8f0;
                        height: 1px;
                        line-height: 1px;
                        margin: 32px 0;
                      "
                    >
                      &zwj;
                    </div>
                    
                  <p>
                    Qualquer dúvida ou sugestão, nossa equipe está à disposição.
                  </p>
                </td>
              </tr>
              <tr role="separator">
                <td style="line-height: 48px">&zwj;</td>
              </tr>
              <tr>
                <td style="padding-left: 24px; padding-right: 24px; text-align: center; font-size: 12px; color: #475569">
                  <p style="margin: 0 0 16px; text-transform: uppercase">
                    ABF - ASSOCIAÇÃO BRASILEIRA DE FRANCHISING
                  </p>
                  <p style="margin: 0; font-style: italic">Aguardamos você!</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`,
    eventSubscriptionOnline: `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="format-detection"
      content="telephone=no, date=no, address=no, email=no, url=no"
    />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings
            xmlns:o="urn:schemas-microsoft-com:office:office"
          >
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,
        th,
        div,
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Segoe UI", sans-serif;
          mso-line-height-rule: exactly;
        }
      </style>
    <![endif]-->
    <title>Confirmamos a sua participação no evento {{event-title}}.</title>
    <style>
      @media (max-width: 600px) {
        .sm-my-8 {
          margin-top: 32px !important;
          margin-bottom: 32px !important;
        }
        .sm-px-4 {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        .sm-px-6 {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }
        .sm-leading-8 {
          line-height: 32px !important;
        }
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      width: 100%;
      background-color: #f8fafc;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      word-break: break-word;
    "
  >
    <div style="display: none">
      Esse é um evento híbrido, atente-se ao formato (online ou presencial)
      selecionado no momento da sua inscrição. &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
      &#8199;&#65279;&#847; &#8199;&#65279;&#847;
    </div>
    <div
      role="article"
      aria-roledescription="email"
      aria-label="Confirmamos a sua participação no evento undefined."
      lang="en"
    >
      <div
        class="sm-px-4"
        style="
          background-color: #f8fafc;
          font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI',
            sans-serif;
        "
      >
        <table align="center" cellpadding="0" cellspacing="0" role="none">
          <tr>
            <td style="width: 552px; max-width: 100%">
              <div
                class="sm-my-8"
                style="
                  margin-top: 48px;
                  margin-bottom: 48px;
                  text-align: center;
                "
              >
                <a href="https://eventos.abf.com.br">
                  <img
                    src="https://www.abf.com.br/wp-content/uploads/2023/07/nova-logo-abf.png"
                    width="270"
                    alt="Eventos ABF"
                    style="
                      max-width: 100%;
                      vertical-align: middle;
                      line-height: 1;
                      border: 0;
                    "
                  />
                </a>
              </div>
              <table
                style="width: 100%"
                cellpadding="0"
                cellspacing="0"
                role="none"
              >
                <tr>
                  <td
                    class="sm-px-6"
                    style="
                      border-radius: 4px;
                      background-color: #fff;
                      padding: 48px;
                      font-size: 16px;
                      color: #334155;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                        0 2px 4px -2px rgba(0, 0, 0, 0.1);
                    "
                  >
                    <h1
                      class="sm-leading-8"
                      style="
                        margin: 0 0 24px;
                        font-size: 24px;
                        font-weight: 600;
                        color: #000;
                      "
                    >
                      Ola, {{user}}
                    </h1>
                    <p style="margin: 0; line-height: 24px">
                      Confirmamos a sua participação no evento {{event-title}}.
                    </p>
                    <p>
                      Esse é um evento que será transmitido no formato
                      <strong>online</strong>.
                    </p>
                    <p><strong>DATA DO EVENTO:</strong> undefined</p>
                    <p><strong>LINK DE TRANSMISSÃO:</strong> undefined</p>
                    <strong style="margin-bottom: 0">IMPORTANTE:</strong>
                    <p style="margin: 0">
                      1- Esta inscrição é válida exclusivamente para o dia
                      {{event-date}}.
                    </p>
                    <div role="separator" style="line-height: 24px">&zwj;</div>
                    <div>
                      <a
                        href="{{schedule_link}}"
                        style="
                          display: inline-block;
                          border-radius: 4px;
                          background-color: #00539a;
                          padding: 16px 24px;
                          font-size: 16px;
                          font-weight: 600;
                          line-height: 1;
                          color: #f8fafc;
                          text-decoration: none;
                        "
                      >
                        <!--[if mso]>
                          <i
                            style="
                              mso-font-width: -100%;
                              letter-spacing: 32px;
                              mso-text-raise: 30px;
                            "
                            hidden
                            >&nbsp;</i
                          >
                        <![endif]-->
                        <span style="mso-text-raise: 16px">
                          Adicione o evento na sua agenda! &rarr;
                        </span>
                        <!--[if mso]>
                          <i
                            style="mso-font-width: -100%; letter-spacing: 32px"
                            hidden
                            >&nbsp;</i
                          >
                        <![endif]-->
                      </a>
                    </div>
                    <div
                      role="separator"
                      style="
                        background-color: #e2e8f0;
                        height: 1px;
                        line-height: 1px;
                        margin: 32px 0;
                      "
                    >
                      &zwj;
                    </div>
                    <strong
                      >Confira a solução dos nossos patrocinadores:</strong
                    >

                 {{container-patrocidadores}}
                    <div
                      role="separator"
                      style="
                        background-color: #e2e8f0;
                        height: 1px;
                        line-height: 1px;
                        margin: 32px 0;
                      "
                    >
                      &zwj;
                    </div>
                    <p>
                      Qualquer dúvida ou sugestão, nossa equipe está à
                      disposição.
                    </p>
                  </td>
                </tr>
                <tr role="separator">
                  <td style="line-height: 48px">&zwj;</td>
                </tr>
                <tr>
                  <td
                    style="
                      padding-left: 24px;
                      padding-right: 24px;
                      text-align: center;
                      font-size: 12px;
                      color: #475569;
                    "
                  >
                    <p style="margin: 0 0 16px; text-transform: uppercase">
                      ABF - ASSOCIAÇÃO BRASILEIRA DE FRANCHISING
                    </p>
                    <p style="margin: 0; font-style: italic">
                      Aguardamos você!
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>
`,
    eventSubscription: `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
  </style>
  <![endif]-->
  <title>Confirmamos a sua participação no evento {{event-title}}.</title>
  <style>
    @media (max-width: 600px) {
      .sm-my-8 {
        margin-top: 32px !important;
        margin-bottom: 32px !important
      }
      .sm-px-4 {
        padding-left: 16px !important;
        padding-right: 16px !important
      }
      .sm-px-6 {
        padding-left: 24px !important;
        padding-right: 24px !important
      }
      .sm-leading-8 {
        line-height: 32px !important
      }
    }
  </style>
</head>
<body style="margin: 0; width: 100%; background-color: #f8fafc; padding: 0; -webkit-font-smoothing: antialiased; word-break: break-word">
  <div style="display: none">
    Esse é um evento híbrido, atente-se ao formato (online ou presencial) selecionado no momento da sua inscrição.
    &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
  </div>
  <div role="article" aria-roledescription="email" aria-label="Confirmamos a sua participação no evento {{event-title}}." lang="en">
    <div class="sm-px-4" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 552px; max-width: 100%">
            <div class="sm-my-8" style="margin-top: 48px; margin-bottom: 48px; text-align: center">
              <a href="https://eventos.abf.com.br">
                <img src="https://www.abf.com.br/wp-content/uploads/2023/07/nova-logo-abf.png" width="270" alt="Eventos ABF" style="max-width: 100%; vertical-align: middle; line-height: 1; border: 0">
              </a>
            </div>
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-px-6" style="border-radius: 4px; background-color: #fff; padding: 48px; font-size: 16px; color: #334155; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)">
                  <h1 class="sm-leading-8" style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #000">
                    Ola, {{user}}
                  </h1>
                  <p style="margin: 0; line-height: 24px">
                    Confirmamos a sua participação <strong>presencial</strong>, no
                    evento {{event-title}}.
                  </p>
                 
                  <p><strong>DATA DO EVENTO:</strong> {{event-date}}</p>
                  <p><strong>LOCAL:</strong> {{event-address}}</p>
                  <strong style="margin-bottom: 0">IMPORTANTE:</strong>
                  <p style="margin: 0;">
                    1- Esta inscrição é válida exclusivamente para o dia
                    {{event-date}}.
                  </p>
                  <p style="margin: 0;">
                    2- Apresente seu QRCode no dia do evento no credenciamento.
                  </p>
                  <div role="separator" style="line-height: 24px">&zwj;</div>
                  <div>
                    <a href="{{schedule_link}}" style="display: inline-block; border-radius: 4px; background-color: #00539a; padding: 16px 24px; font-size: 16px; font-weight: 600; line-height: 1; color: #f8fafc; text-decoration: none">
                      <!--[if mso]>
      <i style="mso-font-width: -100%; letter-spacing: 32px; mso-text-raise: 30px" hidden>&nbsp;</i>
    <![endif]-->
                      <span style="mso-text-raise: 16px">
                  Adicione o evento na sua agenda! &rarr;
                </span>
                      <!--[if mso]>
      <i style="mso-font-width: -100%; letter-spacing: 32px;" hidden>&nbsp;</i>
    <![endif]-->
                    </a>
                  </div>
                  <div role="separator" style="background-color: #e2e8f0; height: 1px; line-height: 1px; margin: 32px 0">&zwj;</div>
                              <strong
                      >Confira a solução dos nossos patrocinadores:</strong
                    >

                 {{container-patrocidadores}}
                    <div
                      role="separator"
                      style="
                        background-color: #e2e8f0;
                        height: 1px;
                        line-height: 1px;
                        margin: 32px 0;
                      "
                    >
                      &zwj;
                    </div>
                  <p>
                    Qualquer dúvida ou sugestão, nossa equipe está à disposição.
                  </p>
                </td>
              </tr>
              <tr role="separator">
                <td style="line-height: 48px">&zwj;</td>
              </tr>
              <tr>
                <td style="padding-left: 24px; padding-right: 24px; text-align: center; font-size: 12px; color: #475569">
                  <p style="margin: 0 0 16px; text-transform: uppercase">
                    ABF - ASSOCIAÇÃO BRASILEIRA DE FRANCHISING
                  </p>
                  <p style="margin: 0; font-style: italic">Aguardamos você!</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`,
    passReset: `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
  </style>
  <![endif]-->
  <title>Recebemos uma solicitação para redefinição de senha.</title>
  <style>
    @media (max-width: 600px) {
      .sm-my-8 {
        margin-top: 32px !important;
        margin-bottom: 32px !important
      }
      .sm-px-4 {
        padding-left: 16px !important;
        padding-right: 16px !important
      }
      .sm-px-6 {
        padding-left: 24px !important;
        padding-right: 24px !important
      }
      .sm-leading-8 {
        line-height: 32px !important
      }
    }
  </style>
</head>
<body style="margin: 0; width: 100%; background-color: #f8fafc; padding: 0; -webkit-font-smoothing: antialiased; word-break: break-word">
  <div style="display: none">
    Se não reconhece essa solicitação, ignore essa mensagem, caso contrário, clique no botão abaixo para alterar sua senha:
    &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
  </div>
  <div role="article" aria-roledescription="email" aria-label="Recebemos uma solicitação para redefinição de senha." lang="en">
    <div class="sm-px-4" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 552px; max-width: 100%">
            <div class="sm-my-8" style="margin-top: 48px; margin-bottom: 48px; text-align: center">
              <a href="https://eventos.abf.com.br">
                <img src="https://www.abf.com.br/wp-content/uploads/2023/07/nova-logo-abf.png" width="270" alt="Eventos ABF" style="max-width: 100%; vertical-align: middle; line-height: 1; border: 0">
              </a>
            </div>
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-px-6" style="border-radius: 4px; background-color: #fff; padding: 48px; font-size: 16px; color: #334155; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)">
                  <h1 class="sm-leading-8" style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #000">
                    Ola, {{user}}
                  </h1>
                  <p style="margin: 0; line-height: 24px">
                    Recebemos uma solicitação para redefinição de senha.
                  </p>
                  <p>
                    Se não reconhece essa solicitação, ignore essa mensagem, caso
                    contrário, clique no botão abaixo para alterar sua senha:
                  </p>
                  <div>
                    <a href="https://eventos.abf.com.br/auth/reset-password/{{token}}" style="display: inline-block; border-radius: 4px; background-color: #00539a; padding: 16px 24px; font-size: 16px; font-weight: 600; line-height: 1; color: #f8fafc; text-decoration: none">
                      <!--[if mso]>
      <i style="mso-font-width: -100%; letter-spacing: 32px; mso-text-raise: 30px" hidden>&nbsp;</i>
    <![endif]-->
                      <span style="mso-text-raise: 16px">
                  Redefinir senha &rarr;
                </span>
                      <!--[if mso]>
      <i style="mso-font-width: -100%; letter-spacing: 32px;" hidden>&nbsp;</i>
    <![endif]-->
                    </a>
                  </div>
                  <p>
                    Por questões de segurança, o link de redefinição expira em 24
                    horas. Se a mesma não for redefinida dentro deste período,
                    precisará ser solicitado um novo link.
                  </p>
                  <div role="separator" style="background-color: #e2e8f0; height: 1px; line-height: 1px; margin: 32px 0">&zwj;</div>
                  <p>Em caso de dúvidas, entre em contato com nosso suporte.</p>
                </td>
              </tr>
              <tr role="separator">
                <td style="line-height: 48px">&zwj;</td>
              </tr>
              <tr>
                <td style="padding-left: 24px; padding-right: 24px; text-align: center; font-size: 12px; color: #475569">
                  <p style="margin: 0 0 16px; text-transform: uppercase">
                    ABF - ASSOCIAÇÃO BRASILEIRA DE FRANCHISING
                  </p>
                  <p style="margin: 0; font-style: italic">Aguardamos você!</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`,
    eventReminder: '<h6>Lembrete de evento a acontecer</h6>',
    welcome: `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
  </style>
  <![endif]-->
  <title>Seja bem-vindo(a), a Plataforma de Eventos da ABF!</title>
  <style>
    @media (max-width: 600px) {
      .sm-my-8 {
        margin-top: 32px !important;
        margin-bottom: 32px !important
      }
      .sm-px-4 {
        padding-left: 16px !important;
        padding-right: 16px !important
      }
      .sm-px-6 {
        padding-left: 24px !important;
        padding-right: 24px !important
      }
      .sm-leading-8 {
        line-height: 32px !important
      }
    }
  </style>
</head>
<body style="margin: 0; width: 100%; background-color: #f8fafc; padding: 0; -webkit-font-smoothing: antialiased; word-break: break-word">
  <div style="display: none">
    Através desse canal, você terá acesso a toda a grade dos eventos realizados pela entidade.
    &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
  </div>
  <div role="article" aria-roledescription="email" aria-label="Seja bem-vindo(a), a Plataforma de Eventos da ABF!" lang="en">
    <div class="sm-px-4" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 552px; max-width: 100%">
            <div class="sm-my-8" style="margin-top: 48px; margin-bottom: 48px; text-align: center">
              <a href="https://eventos.abf.com.br">
                <img src="https://www.abf.com.br/wp-content/uploads/2023/07/nova-logo-abf.png" width="270" alt="Eventos ABF" style="max-width: 100%; vertical-align: middle; line-height: 1; border: 0">
              </a>
            </div>
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-px-6" style="border-radius: 4px; background-color: #fff; padding: 48px; font-size: 16px; color: #334155; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)">
                  <h1 class="sm-leading-8" style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #000">
                    Ola, {{user}}
                  </h1>
                  <p style="margin: 0; line-height: 24px">
                    Seja bem-vindo(a), a Plataforma de Eventos da ABF!
                  </p>
                  <p>
                    Através desse canal, você terá acesso a toda a grade dos
                    eventos realizados pela entidade. Nossa ideia é que seja um
                    acesso fácil e que possa encontrar oportunidades de
                    aprendizado e muito networking.
                  </p>
                  <p>
                    Para seguir com o acesso, siga os passos, através do link
                    abaixo:
                  </p>
                  <div role="separator" style="line-height: 24px">&zwj;</div>
                  <div>
                    <a href="https://eventos.abf.com.br" style="display: inline-block; border-radius: 4px; background-color: #00539a; padding: 16px 24px; font-size: 16px; font-weight: 600; line-height: 1; color: #f8fafc; text-decoration: none">
                      <!--[if mso]>
      <i style="mso-font-width: -100%; letter-spacing: 32px; mso-text-raise: 30px" hidden>&nbsp;</i>
    <![endif]-->
                      <span style="mso-text-raise: 16px">
                  Acesse nossa plataforma &rarr;
                </span>
                      <!--[if mso]>
      <i style="mso-font-width: -100%; letter-spacing: 32px;" hidden>&nbsp;</i>
    <![endif]-->
                    </a>
                  </div>
                  <div role="separator" style="background-color: #e2e8f0; height: 1px; line-height: 1px; margin: 32px 0">&zwj;</div>
                  <p>
                    Qualquer dúvida ou sugestão, nossa equipe está à disposição.
                  </p>
                </td>
              </tr>
              <tr role="separator">
                <td style="line-height: 48px">&zwj;</td>
              </tr>
              <tr>
                <td style="padding-left: 24px; padding-right: 24px; text-align: center; font-size: 12px; color: #475569">
                  <p style="margin: 0 0 16px; text-transform: uppercase">
                    ABF - ASSOCIAÇÃO BRASILEIRA DE FRANCHISING
                  </p>
                  <p style="margin: 0; font-style: italic">Aguardamos você!</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`,
};
