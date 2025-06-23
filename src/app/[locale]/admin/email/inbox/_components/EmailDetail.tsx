const EmailDetail = () => {
  const email = {
    date: '20 June 2022, 9:16 AM',
    from: 'Health Assistant',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis tellus id interdum velit laoreet. Enim eu turpis egestas pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis tellus id interdum velit laoreet. Enim eu turpis egestas pretium.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis tellus id interdum velit laoreet. Enim eu turpis egestas pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis tellus id interdum velit laoreet. Enim eu turpis egestas pretium.`,
    attachments: [
      'ABCDGHJKL.pdf (200kb)',
      'ascasc.pdf (450kb)',
      'dontvjdjmg (300kb)',
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="rounded-lg bg-white p-6 shadow-md">
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
