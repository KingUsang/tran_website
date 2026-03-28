/* functions/worker.js */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get("Origin");
    const configuredOrigins = (env.ALLOWED_ORIGIN || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    const responseOrigin =
      configuredOrigins.length > 0
        ? configuredOrigins.includes(requestOrigin || "")
          ? requestOrigin
          : null
        : requestOrigin || "*";

    // Keep static site delivery working; only process the form endpoint here.
    if (url.pathname !== "/submit") {
      return env.ASSETS.fetch(request);
    }

    if (!responseOrigin) {
      return new Response(
        JSON.stringify({ success: false, message: "Origin not allowed." }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 1. Handle CORS preflight for the submit endpoint.
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": responseOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      // 2. Get Form Data
      const formData = await request.formData();
      const body = {};
      for (const entry of formData.entries()) {
        body[entry[0]] = entry[1];
      }

      // 3. Customize Email based on Form Type
      const formType = body.form_type || "contact";
      const senderEmail = "no-reply@send.therootaccessnetwork.com";
      const toEmail = "info@therootaccessnetwork.com"; // Your email

      const submitterEmailRaw = body.email || body["Email Address"] || body["Email"] || "";
      const submitterEmail = String(submitterEmailRaw).trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const canUseReplyTo =
        (formType === "contact" || formType === "get-involved") &&
        emailRegex.test(submitterEmail);
      let newsletterStatus = "subscribed";

      if (formType === "newsletter") {
        if (!emailRegex.test(submitterEmail)) {
          return new Response(
            JSON.stringify({ success: false, message: "Please enter a valid email address." }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": responseOrigin,
              },
            }
          );
        }

        const newsletterSegmentId = String(env.RESEND_NEWSLETTER_SEGMENT_ID || "").trim();
        if (!newsletterSegmentId) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Newsletter segment is not configured.",
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": responseOrigin,
              },
            }
          );
        }

        const firstName = String(body.name || "").trim();
        const contactPayload = {
          email: submitterEmail,
          unsubscribed: false,
          segments: [{ id: newsletterSegmentId }],
        };

        if (firstName) {
          contactPayload.firstName = firstName;
        }

        const authHeaders = {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        };

        const contactResponse = await fetch("https://api.resend.com/contacts", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(contactPayload),
        });

        let contactData = null;
        try {
          contactData = await contactResponse.json();
        } catch {
          contactData = null;
        }

        const isDuplicate =
          contactResponse.status === 409 ||
          String(contactData?.message || "").toLowerCase().includes("already exists");

        if (!contactResponse.ok && !isDuplicate) {
          return new Response(
            JSON.stringify({
              success: false,
              message: contactData?.message || "Failed to add subscriber to newsletter contacts.",
            }),
            {
              status: 502,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": responseOrigin,
              },
            }
          );
        }

        if (isDuplicate) {
          const addToSegmentResponse = await fetch(
            `https://api.resend.com/contacts/${encodeURIComponent(submitterEmail)}/segments/${newsletterSegmentId}`,
            {
              method: "POST",
              headers: authHeaders,
            }
          );

          let addToSegmentData = null;
          try {
            addToSegmentData = await addToSegmentResponse.json();
          } catch {
            addToSegmentData = null;
          }

          const alreadyInSegment =
            addToSegmentResponse.status === 409 ||
            String(addToSegmentData?.message || "").toLowerCase().includes("already");

          if (!addToSegmentResponse.ok && !alreadyInSegment) {
            return new Response(
              JSON.stringify({
                success: false,
                message:
                  addToSegmentData?.message ||
                  "Failed to add existing subscriber to newsletter segment.",
              }),
              {
                status: 502,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": responseOrigin,
                },
              }
            );
          }

          newsletterStatus = alreadyInSegment ? "already-subscribed" : "subscribed";
        }
      }

      if (formType === "newsletter" && newsletterStatus === "already-subscribed") {
        return new Response(
          JSON.stringify({
            success: true,
            message: "You are already subscribed to the newsletter.",
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": responseOrigin,
            },
          }
        );
      }
      
      let subject = "New Form Submission";

      const escapeHtml = (value) =>
        String(value ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\"/g, "&quot;")
          .replace(/'/g, "&#39;");

      const formatLabel = (key) =>
        String(key)
          .replace(/[_-]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/\b\w/g, (char) => char.toUpperCase());

      const excludedKeys = new Set(["form_type", "g-recaptcha-response"]);
      const fieldRows = Object.entries(body)
        .filter(([key]) => !excludedKeys.has(key))
        .map(
          ([key, value]) => `
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; width: 220px; color: #334155; font-weight: 600; vertical-align: top;">${escapeHtml(formatLabel(key))}</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #0f172a; white-space: pre-wrap; word-break: break-word;">${escapeHtml(value)}</td>
            </tr>
          `
        )
        .join("");

      const safeFormType = escapeHtml(formatLabel(formType));
      const submittedAt = new Date().toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        timeZoneName: "short",
      });

      const htmlContent = `
        <div style="background: #f8fafc; padding: 24px; font-family: Arial, Helvetica, sans-serif; color: #0f172a;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 760px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="background: #0f172a; color: #ffffff; padding: 20px 24px;">
                <div style="font-size: 20px; font-weight: 700; letter-spacing: 0.2px;">The Root Access Network</div>
                <div style="font-size: 13px; margin-top: 6px; color: #cbd5e1;">New Website Submission</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 24px 8px;">
                <div style="font-size: 16px; font-weight: 700; color: #0f172a;">Submission Type: ${safeFormType}</div>
                <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Submitted: ${escapeHtml(submittedAt)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; border-collapse: collapse;">
                  <tbody>
                    ${fieldRows || `<tr><td style="padding: 12px; color: #64748b;">No additional fields provided.</td></tr>`}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 24px; background: #f8fafc; border-top: 1px solid #e5e7eb; font-size: 12px; color: #64748b;">
                This message was generated automatically from your website form endpoint.
              </td>
            </tr>
          </table>
        </div>
      `;

      const textContent = Object.entries(body)
        .filter(([key]) => !excludedKeys.has(key))
        .map(([key, value]) => `${formatLabel(key)}: ${String(value ?? "")}`)
        .join("\n");

      // Specific subject lines
      if (formType === 'newsletter') subject = "🔔 New Newsletter Subscriber";
      if (formType === 'contact') subject = "✉️ New Contact Message";
      if (formType === 'get-involved') subject = "🤝 New Volunteer / Partner";

      // 4. Send via Resend API
      const payload = {
        from: "TRAN Website <" + senderEmail + ">",
        to: [toEmail],
        subject: subject,
        html: htmlContent,
        text: [
          `The Root Access Network - New ${formatLabel(formType)} Submission`,
          `Submitted: ${submittedAt}`,
          "",
          textContent || "No additional fields provided.",
        ].join("\n"),
      };

      if (canUseReplyTo) {
        payload.reply_to = submitterEmail;
      }

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await resendResponse.json();
      if (!resendResponse.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            message: data?.message || "Email delivery failed.",
          }),
          {
            status: 502,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": responseOrigin,
            },
          }
        );
      }

      const successMessage =
        formType === "newsletter"
          ? newsletterStatus === "already-subscribed"
            ? "You are already subscribed to the newsletter."
            : "Thanks! You are now subscribed to the newsletter."
          : "Sent successfully!";

      return new Response(JSON.stringify({ success: true, message: successMessage }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": responseOrigin,
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, message: err.message }), {
        status: 500,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": responseOrigin,
        }
      });
    }
  },
};