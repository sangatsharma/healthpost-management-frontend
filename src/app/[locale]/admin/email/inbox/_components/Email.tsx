import { File, Image, Link, Signature } from 'lucide-react';

const Email = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 rounded-lg bg-purple-600 p-4 text-white">
        <h1 className="text-xl">Good Afternoon, Admin</h1>
        <p className="text-sm">En 2025/5/18 9:00 PM</p>
      </header>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex justify-between">
          <button className="rounded bg-purple-600 px-4 py-2 text-white">
            Add template
          </button>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search health posts"
              className="rounded border p-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Send Email To:
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" defaultChecked />
              <span className="ml-2">All Health Posts</span>
            </label>
            <label className="ml-6 inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Single Health Posts</span>
            </label>
            <label className="ml-6 inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Patients</span>
            </label>
            <label className="ml-6 inline-flex items-center">
              <input type="checkbox" className="form-checkbox" defaultChecked />
              <span className="ml-2">Specific Patients</span>
            </label>
            <label className="ml-6 inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Others</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Choose
          </label>
          <div className="mt-2">
            <p>Chosed :</p>
            <button className="mr-2 rounded bg-gray-200 px-2 py-1">
              Nurse
            </button>
            <button className="mr-2 rounded bg-gray-200 px-2 py-1">
              Lab Assistant
            </button>
            <button className="rounded bg-gray-200 px-2 py-1">ANM</button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Template
          </label>
          <select className="mt-2 w-full rounded border p-2">
            <option>Placeholder</option>
          </select>
        </div>
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Subject"
            className="w-1/2 rounded border p-2"
          />
          <div className="flex space-x-2">
            <button className="text-gray-500">
              <File />
            </button>
            <button className="text-gray-500">
              <Image />
            </button>
            <button className="text-gray-500">
              <Link />
            </button>
            <button className="text-gray-500">
              <Signature />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            className="h-32 w-full rounded border p-2"
            placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button className="rounded bg-purple-600 px-4 py-2 text-white">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Email;
