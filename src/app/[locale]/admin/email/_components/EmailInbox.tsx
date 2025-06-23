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
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4">
          <h2 className="text-lg">
            Sent <span className="text-gray-500">2445 messages</span>
          </h2>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded bg-gray-200 p-2 text-gray-800"
          />
        </div>
        <div className="max-h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="mb-4 rounded-lg bg-gray-50 p-4 text-gray-800"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{msg.name}</h3>
                <span className="text-gray-500">{msg.time}</span>
              </div>
              <p className="mt-2">{msg.content}</p>
              <div className="mt-2 font-light text-white">
                {msg.attachments.map((attachment, i) => (
                  <span
                    key={i}
                    className="mr-2 rounded-sm border-0 bg-blue-600 p-1"
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
