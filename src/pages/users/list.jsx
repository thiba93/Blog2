import { pageValidator } from "@/utils/validators";
import UserComponent from "@/web/components/UserComponent";
import Pagination from "@/web/components/ui/Pagination";
import config from "@/web/config";
import { readResource } from "@/web/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: pageValidator.validateSync(page),
  },
});

const UsersPage = (props) => {
  const router = useRouter();
  const { page } = props;
  const {
    isLoading,
    data: { data: { result: users, meta: { count } = {} } = {} } = {},
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => readResource("users", { params: { page } }),
  });
  const countPages = Math.ceil(count / config.pagination.limit);



  const deleteUser = async (userId) => {
    // Appel à l'API pour supprimer l'utilisateur
    await fetch(`/api/users?userId=${userId}`, {
      method: 'DELETE',
    });
    // Recharger les utilisateurs ou gérer la mise à jour de l'interface utilisateur
  };

  if (isLoading || !users) {
    return <div className="text-center p-32 animate-bounce">Loading...</div>;
  }

  return (
    <div className="py-4 flex flex-col gap-16">
      <ul className="flex flex-col gap-8">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center">
            <UserComponent {...user} />
            <div>
              {/* Modification ici pour le bouton Edit */}
          
              <button onClick={() => deleteUser(user.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination pathname="/users/list" page={page} countPages={countPages} />
    </div>
  );
};

export default UsersPage;