// import { zodResolver } from '@hookform/resolvers/zod';
// import React from 'react';
// import { useForm } from 'react-hook-form';

// import { Button } from '@/components/ui/button';
// import { DialogFooter } from '@/components/ui/dialog';
// import { Form } from '@/components/ui/form';
// import FormDialog from '@/components/reusables/form-dialog';

// type TProps = {
//   isOpen: boolean;
//   toggleModal: () => void;
//   actionType: 'add' | 'edit';
// };

// export const AddManagerModal: React.FC<TProps> = ({
//   isOpen,
//   toggleModal,
//   actionType,
// }) => {
//   const form = useForm<TManagerSchema>({
//     resolver: zodResolver(ManagerSchema),

//     mode: 'onChange',
//   });
//   const {
//     handleSubmit,
//     reset,
//     formState: { dirtyFields },
//   } = form;

//   const onSubmit = (): void => {};

//   const handleExit = (): void => {
//     reset();
//     toggleModal();
//   };

//   return (
//     <React.Fragment>
//       <FormDialog
//         isOpen={isOpen}
//         toggleModal={handleExit}
//         title="Add New HealthPost"
//         className="sm:max-w-lg md:max-w-4xl"
//         isFormDirty={Object.keys(dirtyFields).length > 0}
//       >
//         <Form {...form}>
//           <form onSubmit={handleSubmit(onSubmit)}>

//             <DialogFooter className="md:mt-8">
//               <div className="my-4 flex w-full justify-between">
//                 <Button
//                   variant={'ghost'}
//                   className="font-normal hover:bg-transparent"
//                   onClick={() => reset()}
//                 >
//                   Reset
//                 </Button>
//                 <Button
//                   className="rounded-sm"
//                   type="submit"
//                   disabled={!Object.keys(dirtyFields).length}
//                 >
//                   Add Health Post
//                 </Button>
//               </div>
//             </DialogFooter>
//           </form>
//         </Form>
//       </FormDialog>
//     </React.Fragment>
//   );
// };
