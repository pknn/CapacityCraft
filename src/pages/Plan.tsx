import SprintDetailsInput from '../components/SprintDetailsInput';
import UserOverlay from '../components/UserOverlay';

const Plan = () => {
  return (
    <div>
      <UserOverlay />
      <h1 className="text-lg font-extrabold">Plan</h1>
      <SprintDetailsInput />
    </div>
  );
};

export default Plan;
