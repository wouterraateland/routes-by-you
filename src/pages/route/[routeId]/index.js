export default function RoutePage() {
  return null;
}

export async function getServerSideProps({ params }) {
  const { routeId } = params;
  return {
    redirect: {
      permanent: true,
      destination: `/route/${routeId}/repeats`,
    },
  };
}
