import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import FormDialog from './form-dialog';
import { toast } from 'sonner';
import {
  ExportFileType,
  TAllowedExportFileTypes,
  TToastTexts,
} from '@/types/global';
import { Download } from 'lucide-react';

type TProps = {
  isOpen: boolean;
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  fileInfo: ExportFileType;
  setFileInfo: React.Dispatch<React.SetStateAction<ExportFileType>>;
  onDownload: () => void;
};

const ExportFiles: TToastTexts = {
  success: {
    title: 'Success',
    description: 'Files has been exported successfully',
  },
  error: {
    title: 'Error',
    description: 'Something went wrong. Please try again.',
  },
  noFileName: {
    title: 'Error',
    description: 'Please enter a file name.',
  },
};

const SaveFile: React.FC<TProps> = ({
  isOpen,
  toggleModal,
  fileInfo,
  setFileInfo,
  onDownload,
}) => {
  const handleDownload = (): void => {
    if (!fileInfo.name.length) {
      toast.error(ExportFiles.noFileName.title, {
        description: ExportFiles.noFileName.description,
      });
      return;
    }
    onDownload();
    toggleModal((prev) => !prev);
    setFileInfo({ name: '', sheet: '', type: 'xlsx' });
  };

  useEffect(() => {
    if (!isOpen) {
      setFileInfo({ name: '', sheet: '', type: 'xlsx' });
    }
  }, [isOpen]);

  return (
    <FormDialog
      title="Save File"
      isOpen={isOpen}
      toggleModal={() => toggleModal((prev) => !prev)}
      className="max-w-[300px] p-4"
      isFormDirty={true}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="filename" className="ml-2" required>
            File Name
          </Label>
          <Input
            id="filename"
            onChange={(e) =>
              setFileInfo((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
            className="w-full bg-emerald-50"
            placeholder="Enter file name"
          />
        </div>

        <div className="space-y-2">
          <Label className="ml-2" required>
            File Type
          </Label>
          <Select
            defaultValue="xlsx"
            onValueChange={(e) =>
              setFileInfo((prevState) => ({
                ...prevState,
                type: e as TAllowedExportFileTypes,
              }))
            }
          >
            <SelectTrigger className="!h-12 w-full bg-emerald-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="xlsx">XLSX</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="txt">Text</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleDownload} className="mx-auto w-full">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </div>
    </FormDialog>
  );
};

export default SaveFile;
