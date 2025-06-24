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
    <div className="min-h-screen p-6">
      <div className="rounded-lg p-6 shadow-md">
        <div className="mb-4 flex justify-between">
          <div>
            <a href="#" className="mr-2 text-purple-600">
              Health Assistant
            </a>
            <a href="#" className="text-purple-600">
              Patients
            </a>
          </div>
          <span className="text-gray-500">{email.date}</span>
        </div>
        <div className="mb-4">
          <p className="whitespace-pre-wrap">{email.content}</p>
        </div>
        <div className="mb-4 text-blue-500">
          {email.attachments.map((attachment, i) => (
            <span key={i} className="mr-2">
              {attachment}
            </span>
          ))}
        </div>
        <button className="rounded bg-gray-200 px-4 py-2 text-gray-700">
          Forward
        </button>
      </div>
    </div>
  );
};

export default EmailDetail;
