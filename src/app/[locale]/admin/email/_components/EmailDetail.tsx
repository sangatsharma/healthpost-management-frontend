const EmailDetail = () => {
  const email = {
    date: '20 June 2022, 9:16 AM',
    from: 'Amarsingh Health Post',
    content: `📢 Notice from Health Assistant

Please ensure your health profile is complete and up to date. Accurate information about your medical history, ongoing conditions, and medications helps us provide better support and timely recommendations.

✔️ Update your profile  
✔️ Set reminders for medications and appointments  
✔️ Reach out for any health-related concerns or questions

Your well-being is important to us. Thank you for taking proactive steps toward better health.`,
    attachments: [
      'Health_Profile_Guide.pdf (1.5MB)',
      'Medication_Reminder_Setup.pdf (800KB)',
    ],
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="bg-card border-border rounded-lg border p-6 shadow-md">
        <div className="mb-4 flex justify-between">
          <div>
            <a
              href="#"
              className="text-primary hover:text-primary/80 mr-2 transition-colors"
            >
              Health Assistant
            </a>
            <a
              href="#"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Patients
            </a>
          </div>
          <span className="text-muted-foreground">{email.date}</span>
        </div>
        <div className="mb-4">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {email.content}
          </p>
        </div>
        <div className="mb-4">
          {email.attachments.map((attachment, i) => (
            <span
              key={i}
              className="bg-accent text-accent-foreground mr-2 inline-block rounded px-2 py-1 text-sm"
            >
              {attachment}
            </span>
          ))}
        </div>
        <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring rounded px-4 py-2 transition-colors focus:ring-2 focus:ring-offset-2">
          Forward
        </button>
      </div>
    </div>
  );
};

export default EmailDetail;
