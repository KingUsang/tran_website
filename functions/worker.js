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

        const contactResponse = await fetch("https://api.resend.com/contacts", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactPayload),
        });

        let contactData = null;
        try {
          contactData = await contactResponse.json();
        } catch {
          contactData = null;
        }

        if (!contactResponse.ok && contactResponse.status !== 409) {
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
      }
      
      let subject = "New Form Submission";
      let htmlContent = `<h2>New Submission: ${formType}</h2><ul>`;

      // Build HTML list of all fields
      for (const [key, value] of Object.entries(body)) {
        if (key !== "form_type" && key !== "g-recaptcha-response") {
           htmlContent += `<li><strong>${key}:</strong> ${value}</li>`;
        }
      }
      htmlContent += "</ul>";

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
          ? "Thanks! You are now subscribed to the newsletter."
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