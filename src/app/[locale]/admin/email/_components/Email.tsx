import { File, Image, Link, Signature } from 'lucide-react';

const Email = () => {
  return (
    <div className="bg-background min-h-screen p-6">
      <div className="bg-card rounded-lg p-6 shadow-md">
        <div className="mb-4 flex justify-between">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring rounded px-4 py-2 transition-colors focus:ring-2 focus:ring-offset-2">
            Add template
          </button>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search health posts"
              className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring rounded p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-foreground block text-sm font-medium">
            Send Email To:
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox accent-primary"
                defaultChecked
              />
              <span className="text-foreground ml-2">All Health Posts</span>
            </label>
            <label className="ml-6 inline-flex items-center">
              <input type="checkbox" className="form-checkbox accent-primary" />
              <span className="text-foreground ml-2">Single Health Posts</span>
            </label>
            <label className="ml-6 inline-flex items-center">
              <input type="checkbox" className="form-checkbox accent-primary" />
              <span className="text-foreground ml-2">Patients</span>
            </label>
            <label className="ml-6 inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox accent-primary"
                defaultChecked
              />
              <span className="text-foreground ml-2">Specific Patients</span>
            </label>
            <label className="ml-6 inline-flex items-center">
              <input type="checkbox" className="form-checkbox accent-primary" />
              <span className="text-foreground ml-2">Others</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-foreground block text-sm font-medium">
            Choose
          </label>
          <div className="mt-2">
            <p className="text-foreground">Chosed :</p>
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 mr-2 rounded px-2 py-1 transition-colors">
              Nurse
            </button>
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 mr-2 rounded px-2 py-1 transition-colors">
              Lab Assistant
            </button>
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-2 py-1 transition-colors">
              ANM
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-foreground block text-sm font-medium">
            Select Template
          </label>
          <select className="border-border bg-input text-foreground focus:border-ring focus:ring-ring mt-2 w-full rounded p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <option>Placeholder</option>
          </select>
        </div>
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Subject"
            className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-1/2 rounded p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          />
          <div className="flex space-x-2">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <File />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Image />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Link />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Signature />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-foreground block text-sm font-medium">
            Message
          </label>
          <textarea
            className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring h-32 w-full resize-none rounded p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring rounded px-4 py-2 transition-colors focus:ring-2 focus:ring-offset-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Email;
