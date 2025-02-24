import { useRouter } from 'vue-router';

export const useRoutes = () => {
  const router = useRouter();
  const routes = router.getRoutes();

  const getRoutes = () => {
    return routes.map(route => ({
      name: route.name,
      path: route.path,
    }));
  };

  const findRouteByName = (name) => {
    return routes.find(route => route.name === name);
  };

  return {
    getRoutes,
    findRouteByName,
  };
};
