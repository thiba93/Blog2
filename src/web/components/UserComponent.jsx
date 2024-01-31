const UserComponent = ({ id, name, email, ...otherProps }) => {
    return (
      <div className="user-component">
        <h3>{name}</h3>
        <p>Email: {email}</p>
        {/* Render other user details as needed */}
      </div>
    );
  };
  
  export default UserComponent;
  