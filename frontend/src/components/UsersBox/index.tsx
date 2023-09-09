import { useState } from "react";
import { Avatar, Button, UsersBoxContainer, UsersPanel } from "./styles";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { firestore } from "../../config/firebase";


export function UsersBox() {
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  }

  const [users] = useCollection(collection(firestore, 'users'))

  return (
    <UsersBoxContainer>
      { users && (
        <>
          <UsersPanel isOpen={showPanel}>
            {users?.docs.map((user) => (
              <li key={user.id}>
                <Avatar online={user.data().lastOnline ? user.data().lastOnline.toDate() > new Date(Date.now() - 1 * 60 * 1000) : false }>
                  <img src={user.data().avatarUrl} alt="" />
                </Avatar>
                {user.data().name}
              </li>
            ))}
          </UsersPanel>
          <Button onClick={togglePanel} active={showPanel}>
            {users?.docs.length} usuários
          </Button>
        </>
      )}
    </UsersBoxContainer>
  );
}