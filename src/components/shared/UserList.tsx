const UserList = ({ users }) => {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {users?.map((user) => (
          <div key={user.$id} className="user-item">
            <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt={user.name} className="w-16 h-16 rounded-full" />
            <p className="mt-2">{user.name}</p>
            <p className="text-light-3">@{user.username}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default UserList;
  