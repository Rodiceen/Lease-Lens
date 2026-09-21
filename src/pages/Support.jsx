import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, LifeBuoy, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const FAQS = [
  {
    q: "What does the overall risk score mean?",
    a: "It's a 0–100 score where higher means riskier. 0–39 is low risk, 40–69 is moderate, and 70–100 is high. It reflects how many dangerous or non-standard clauses were found and how serious they are.",
  },
  {
    q: "How accurate is the analysis?",
    a: "LeaseLens uses AI to flag risky clauses and map them to local tenant law. It's for general guidance only and is not legal advice. For binding decisions, consult a qualified tenant-rights attorney in your jurisdiction.",
  },
  {
    q: "Which file types can I upload?",
    a: "You can upload PDF, DOC, DOCX, TXT, HTML, and image files (PNG, JPG). We extract the text from the document before analysis.",
  },
  {
    q: "Can I analyze a lease in another language?",
    a: "Yes. Pick an output language and the plain-language explanations will be written in that language. The original quoted clause text is kept as-is so you can compare it to your lease.",
  },
  {
    q: "Where are my saved reports?",
    a: "Every analysis is saved automatically. You can view, download as PDF, or delete them from the Saved Reports page.",
  },
  {
    q: "Is my lease data private?",
    a: "Yes. Only you can see the leases you analyze; other users can't access your records.",
  },
];

export default function Support() {
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => setUser(u)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    try {
      await base44.entities.SupportTicket.create({
        subject: subject.trim(),
        message: message.trim(),
        contact_email: user?.email || "",
        status: "open",
      });
      toast({ title: "Message sent", description: "We'll get back to you soon." });
      setSubject("");
      setMessage("");
    } catch (err) {
      toast({ title: "Could not send", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find quick answers below, or send us a message and we'll help with your lease analysis.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <LifeBuoy className="w-4 h-4" /> Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border last:border-b-0">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">Contact us</h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What do you need help with?"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or issue…"
              className="min-h-[120px]"
              required
            />
          </div>
          <Button type="submit" disabled={sending} className="gap-2">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </div>
  );
}