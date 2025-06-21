const EmailInbox = () => {
  const messages = [
    {
      name: 'Jeanne Nesty',
      time: '3:13 PM',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ...',
      attachments: [
        'ABCDGHJKL.pdf (200kb)',
        'ascasc.pdf (450kb)',
        'dontvjdjmg (300kb)',
      ],
    },
    {
      name: 'Jeanne Nesty',
      time: '3:13 PM',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ...',
      attachments: [
        'ABCDGHJKL.pdf (200kb)',
        'ascasc.pdf (450kb)',
        'dontvjdjmg (300kb)',
      ],
    },
    {
      name: 'Jeanne Nesty',
      time: '3:13 PM',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ...',
      attachments: [
        'ABCDGHJKL.pdf (200kb)',
        'ascasc.pdf (450kb)',
        'dontvjdjmg (300kb)',
      ],
    },
    {
      name: 'Jeanne Nesty',
      time: '3:13 PM',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ...',
      attachments: [
        'ABCDGHJKL.pdf (200kb)',
        'ascasc.pdf (450kb)',
        'dontvjdjmg (300kb)',
      ],
    },
    {
      name: 'Jeanne Nesty',
      time: '3:13 PM',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ...',
      attachments: [
        'ABCDGHJKL.pdf (200kb)',
        'ascasc.pdf (450kb)',
        'dontvjdjmg (300kb)',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <header className="mb-6 rounded-lg bg-purple-600 p-4 text-white">
        <h1 className="text-xl">Good Afternoon, Admin</h1>
        <p className="text-sm">En 2025/5/18 9:00 PM</p>
      </header>
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
            <div className="mt-2 text-blue-500">
              {msg.attachments.map((attachment, i) => (
                <span key={i} className="mr-2">
                  {attachment}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailInbox;
