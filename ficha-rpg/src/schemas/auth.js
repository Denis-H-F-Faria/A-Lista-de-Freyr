import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: yup.string().required('Senha é obrigatória'),
});

export const campanhaSchema = yup.object().shape({
  nome: yup.string().required('O nome da campanha é obrigatório'),
  sistema: yup
    .string()
    .oneOf(['D&D', 'Tormenta', 'Sistema Próprio'], 'Sistema inválido')
    .required('O sistema da campanha é obrigatório'),
});