const translateDic = [
  {
    in: "An account with the given email already exists.",
    out: {
      type: "email",
      message:
        "Já existe usuário cadastrado com o e-mail informado, faça o login ou solicite o reenvio de senha",
    },
  },
  {
    in: "Username should be an email.",
    out: {
      type: "email",
      message: "É necessária a inclusão de um e-mail válido",
    },
  },
  {
    in: "Username cannot be empty",
    out: {
      type: "email",
      message: "É necessária a inclusão de um e-mail válido",
    },
  },
  {
    in: "Password cannot be empty",
    out: {
      type: "password",
      message: "É necessária a inclusão de um password",
    },
  },
  {
    in:
      "Password did not conform with policy: Password must have lowercase characters",
    out: {
      type: "password",
      message:
        "A senha deve conter pelo menos 8 digitos e incluir ao menos 1 letra maiúscula, 1 minuscula, um número e um caractere especial",
    },
  },
  {
    in:
      "Password did not conform with policy: Password must have symbol characters",
    out: {
      type: "password",
      message:
        "A senha deve conter pelo menos 8 digitos e incluir ao menos 1 letra maiúscula, 1 minuscula, um número e um caractere especial",
    },
  },
  {
    in:
      "Password did not conform with policy: Password must have uppercase characters",
    out: {
      type: "password",
      message:
        "A senha deve conter pelo menos 8 digitos e incluir ao menos 1 letra maiúscula, 1 minuscula, um número e um caractere especial",
    },
  },
  {
    in: "Password did not conform with policy: Password not long enough",
    out: {
      type: "password",
      message:
        "A senha deve conter pelo menos 8 digitos e incluir ao menos 1 letra maiúscula, 1 minuscula, um número e um caractere especial",
    },
  },
  {
    in: "Attribute value for name must not be null",
    out: {
      type: "name",
      message: "É necessária a inclusão de um nome",
    },
  },
];

const attrGenericMessagesDic = [
  {
    in: "password",
    out:
      "A senha deve conter pelo menos 8 digitos e incluir ao menos 1 letra maiúscula, 1 minuscula, um número e um caractere especial",
  },
];

const customErrorMessages = (message) => {
  const messages = message.split(";");

  const messagesTranslated = [];

  for (let i = 0; i < messages.length; i++) {
    const converted = convertMessage(messages[i]);
    if (!messagesTranslated.find((item) => item.type == converted.type))
      messagesTranslated.push(converted);
  }

  return messagesTranslated;
};

const convertMessage = (msg) => {
  let returnMessage = translateDic.find((item) => {
    return item.in == msg;
  });
  if (returnMessage) return returnMessage.out;

  for (let i = 0; i < attrGenericMessagesDic.length; i++) {
    const attr = attrGenericMessagesDic[i];

    if (msg.match(`'${attr.in}'`)) {
      return { type: attr.in, message: attr.out };
    }
  }

  //   const parts = msg.split(":");
  //   if (parts.length > 1) {
  //     const attrPart = parts[parts.length - 2];
  //     const attr = attrPart.match("'(.*)'");

  //     if (attr) {
  //       let attrMessage = attrGenericMessagesDic.find((item) => item.in == attr);
  //       if (attrMessage)
  //         return {
  //           type: attr,
  //           message: attrMessage,
  //         };
  //     }
  //   }

  console.log("mensagem de erro nova", msg);

  return {
    type: "general",
    message: msg,
  };
};

export default customErrorMessages;
