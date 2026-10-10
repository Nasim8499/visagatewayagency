import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SCHEMA = `Return ONLY JSON (no markdown) with this shape:
{"title":string,"country":string,"visaType":string,"applicant":{"fullName":string,"passportNumber":string,"nationality":string,"dateOfBirth":string,"gender":string,"issueDate":string,"expiryDate":string,"placeOfIssue":string},"employer":{"name":string,"jobTitle":string,"salary":string},"body":string,"checklist":string[]}
Extract applicant fields from the attached passport image if provided; otherwise use details in the prompt, else leave "". "body" is a formal 2-4 paragraph official letter. "checklist" is the country-specific required documents (6-12 items).`;

export const Route = createFileRoute("/api/generate-doc")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { prompt, image } = (await request.json()) as { prompt?: string; image?: string };
        if (!prompt) return Response.json({ error: "prompt required" }, { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return Response.json({ error: "AI not configured" }, { status: 500 });
        const gateway = createLovableAiGatewayProvider(key);
        try {
          const content: Array<{ type: "text"; text: string } | { type: "image"; image: string }> = [
            { type: "text", text: `${SCHEMA}\n\nUser request: ${prompt}` },
          ];
          if (image) content.push({ type: "image", image });
          const { text } = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            system: "You are VisaHOBe document engine generating official visa/immigration documents.",
            messages: [{ role: "user", content }],
          });
          const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
          return Response.json(JSON.parse(json));
        } catch (e) {
          return Response.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
        }
      },
    },
  },
});
