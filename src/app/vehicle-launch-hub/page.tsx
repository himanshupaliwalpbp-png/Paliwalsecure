import { redirect } from 'next/navigation';

// Legacy page — redirects to the fully i18n-translated vehicle launch hub
export default function VehicleLaunchHubRedirect() {
  redirect('/hub/vehicle-launch');
}
