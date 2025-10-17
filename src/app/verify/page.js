import Verify from "../../components/admin/verify";
import { Suspense } from "react";

const TrainersPage = () => {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <Verify />
    </Suspense>
  );
};

export default TrainersPage;
