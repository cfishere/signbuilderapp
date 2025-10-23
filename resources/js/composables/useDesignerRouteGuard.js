// composables/useDesignerRouteGuard.js
import { useRouter } from 'vue-router';
import { usePage } from '@inertiajs/vue3';

export function useDesignerRouteGuard(props) {
  const router = useRouter();
  const page = usePage();
  const user = page.props.auth?.user;

  // Allow if logged in
  if (user) return true;

  // Bypass validation if designId is present
  if (props.designId) return true;

   const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const hasValidEmail = typeof props.email === 'string' && pattern.test(props.email);
   const hasValidPostal = typeof props.postalCode === 'string' && props.postalCode.trim().length >= 3;

   const width = Number(props.width);
  const height = Number(props.height);

console.log("Width is: "+props.width);

const isInvalid = isNaN(width) || width <= 0 ||
  isNaN(height) || height <= 0 ||
  !props.signType || typeof props.signType !== 'string' || props.signType.trim() === '' ||
  !hasValidPostal || !hasValidEmail;

  if (isInvalid) {
    alert('Missing or invalid form input. Please review and correct the form.');
    router.back();
    return false;
  }

  return true;
}
