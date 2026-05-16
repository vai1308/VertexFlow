import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Textarea } from "../ui/textarea.jsx";
import { Alert } from "../ui/alert.jsx";

export function SupportModal({ onSubmit, onCancel, error }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError("");

    if (!subject.trim() || !message.trim()) {
      setLocalError("Please provide both a subject and a message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(subject.trim(), message.trim());
      setSubject("");
      setMessage("");
      setSuccessMessage("Your support request has been submitted successfully!");
      setTimeout(() => {
        onCancel();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Card>
          <CardHeader className="modal-header">
            <div className="modal-title-row">
              <div>
                <span className="page-kicker">Support</span>
                <CardTitle>Contact the team</CardTitle>
              </div>
              <button className="modal-close" onClick={onCancel} type="button" aria-label="Close">
                <X size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {(error || localError) && <Alert variant="destructive">{error || localError}</Alert>}

            <form className="settings-form" onSubmit={handleSubmit}>
              <label>
                Topic
                <Input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="What can we help you with?"
                  maxLength={120}
                  disabled={isSubmitting}
                />
              </label>

              <label>
                Message
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Describe your issue or question in detail."
                  rows={8}
                  disabled={isSubmitting}
                />
              </label>

              <div className="form-actions">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
