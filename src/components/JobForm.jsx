import { useForm } from 'react-hook-form';

const JobForm = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('title')} placeholder="Job Title" className="input" />
      <input {...register('company')} placeholder="Company" className="input" />
      <input {...register('location')} placeholder="Location" className="input" />
      <textarea {...register('description')} placeholder="Job Description" className="textarea"></textarea>
      <button type="submit" className="btn">Post Job</button>
    </form>
  );
};

export default JobForm;
