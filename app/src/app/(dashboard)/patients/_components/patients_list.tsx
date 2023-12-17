import { Suspense } from "react";

import PatientCard from "@/app/(dashboard)/patients/_components/patient_card";
import { createServerClientAndGetSession } from "@/utils/supabase";

const PatientsList = async () => {
  const { supabase, session } = await createServerClientAndGetSession();

  const { data: patients } = await supabase.from("patients").select("*");
  if (!patients) {
    // TODO: add better empty state
    return <PatientsListSkeleton />;
  }

  return (
    <div className="flex flex-row flex-wrap gap-4 p-8">
      {patients.map((patient) => (
        <Suspense key={patient.id} fallback={<PatientCard.Skeleton />}>
          <PatientCard key={patient.id} patientId={patient.id} />
        </Suspense>
      ))}
    </div>
  );
};

const PatientsListSkeleton = () => (
  <div className="flex h-full w-full items-center justify-center">
    Loading...
  </div>
);
PatientsList.Skeleton = PatientsListSkeleton;

export default PatientsList;
