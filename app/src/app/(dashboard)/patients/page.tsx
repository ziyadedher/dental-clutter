import { Suspense } from "react";

import Header from "@/app/(dashboard)/patients/_components/header";
import PatientsList from "@/app/(dashboard)/patients/_components/patients_list";

const Page = () => {
  return (
    <div className="h-full">
      <Header />
      <Suspense fallback={<PatientsList.Skeleton />}>
        <PatientsList />
      </Suspense>
    </div>
  );
};

export default Page;
