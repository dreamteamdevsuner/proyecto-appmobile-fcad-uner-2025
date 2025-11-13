import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PrivateStackParamList } from '../../navigator/types';

import ROUTES from '../../navigator/routes';

import { useAuth } from '@appContext/authContext';
import Conversacion from '@components/conversacion';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.RECRUITER_CONVERSACION
>;

const ConversacionRecruiter: React.FC<Props> = ({ route }) => {
  const {
    title,
    myName,
    otherAvatarUrl,
    myAvatarUrl,
    idOfertaTrabajoMatch,
    idUsuarioProfesional,
  } = route.params;

  const {
    state: { user: usuarioLogueado },
  } = useAuth();

  return (
    <Conversacion
      usuarioLogueado={usuarioLogueado}
      title={title}
      myName={myName}
      otherAvatarUrl={otherAvatarUrl}
      myAvatarUrl={myAvatarUrl}
      idOfertaTrabajoMatch={idOfertaTrabajoMatch}
      idUsuarioProfesional={idUsuarioProfesional}
    />
  );
};

export default ConversacionRecruiter;
