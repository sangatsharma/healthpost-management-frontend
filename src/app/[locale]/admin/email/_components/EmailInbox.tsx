const EmailInbox = () => {
  const messages = [
    {
      name: 'Bagar Health Post',
      time: '10:45 AM',
      content:
        'Please find attached the updated patient reports for your review. Let me know if you have any questions.',
      attachments: [
        'Patient_Report_2025.pdf (1.2MB)',
        'Lab_Results_2025.pdf (850KB)',
      ],
    },
    {
      name: 'Lakeside Health Post',
      time: '2:30 PM',
      content:
        'The quarterly financial report is attached. Please review and provide your feedback by EOD.',
      attachments: ['Q2_Financial_Report.pdf (2.5MB)'],
    },
    {
      name: 'Amarsingh Health Post',
      time: '8:00 AM',
      content: `📢 Notice from Health Assistant Please ensure your health profile is complete and up to date.`,
      attachments: [
        'Health_Profile_Guide.pdf (1.5MB)',
        'Medication_Reminder_Setup.pdf (800KB)',
      ],
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card border-border rounded-lg border p-6 shadow-md">
        <div className="mb-4">
          <h2 className="text-foreground text-lg font-semibold">
            Sent{' '}
            <span className="text-muted-foreground font-normal">
              2445 messages
            </span>
          </h2>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-full rounded border p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          />
        </div>
        <div className="scrollbar-thin-custom max-h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="bg-muted text-foreground border-border/50 hover:bg-muted/80 mb-4 rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-foreground text-lg font-medium">
                  {msg.name}
                </h3>
                <span className="text-muted-foreground text-sm">
                  {msg.time}
                </span>
              </div>
              <p className="text-foreground mt-2 text-sm leading-relaxed">
                {msg.content}
              </p>
              <div className="mt-3">
                {msg.attachments.map((attachment, i) => (
                  <span
                    key={i}
                    className="bg-primary text-primary-foreground mr-2 inline-block rounded-sm px-2 py-1 text-xs"
                  >
                    {attachment}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailInbox;
