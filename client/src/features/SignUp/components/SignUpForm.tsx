import SignUpButton from './SignUpButton';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, SignUpFormData } from "../../../types/types";
import { registerUser } from '../../../api/registerApi';
import TermsAndConditions from './TermsAndConditions';
import { styles } from '../../../style';
import { z, ZodType} from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SpinerModal from '../../../components/SpinnerModal';
import { useState } from 'react';

const SignUpForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const schema: ZodType<SignUpFormData> = z.object({
        name: z.string().min(2, { message: 'Por favor introduce un nombre válido' }).regex(/^[^\d]+$/, { message: 'El nombre no debe contener números' }),
        lastName: z.string().min(2, { message: 'Por favor introduce un apellido válido' }).regex(/^[^\d]+$/, { message: 'El nombre no debe contener números' }),
        gender: z.string(),
        phoneNumber: z.string().min(9, { message: 'El número teléfono no es valido' }),
        email: z.string().email({ message: 'El correo introducido no es válido'}),
        password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres'}).max(14),
        confirmPassword: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres'}).max(14),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no cohinciden",
        path: ["confirmPassword"],
    });

    const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm<SignUpFormData>({resolver: zodResolver(schema)})

    const mutationFn = async ({ name, lastName, gender, phoneNumber, email, password }: SignUpFormData) => registerUser(name, lastName, gender, phoneNumber, email, password);

    const mutation = useMutation<User, Error, SignUpFormData>(
        {
            mutationFn,
            onSuccess: () => {
                setIsLoading(false);
                navigate('/');
            },
            onError: (error) => console.error('Error:', error),
        }
    );

    const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
        const  name = data.name;
        const lastName = data.lastName;
        const gender = data.gender;
        const phoneNumber = data.phoneNumber;
        const email = data.email;
        const password = data.password;

        mutation.mutate({ name, lastName, gender, phoneNumber, email, password });
        setIsLoading(true);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 flex flex-col w-full" action="#" method="POST"> 
                <label htmlFor="name" role='label' aria-label='name' className={`${styles.label}`}>Nombre:</label>
                <input
                    {...register('name')}
                    type="text"
                    aria-label='name'
                    className={`${styles.input}`} />
                {errors.name && <span className='text-[14px] text-[#FF0000]'>{errors.name.message}</span>}

                <label htmlFor="lastName" role='label' aria-label='lastName' className={`${styles.label}`}>Apellido:</label>
                <input
                    {...register('lastName')}
                    type="text"
                    aria-label='lastName'
                    className={`${styles.input}`} />
                {errors.lastName && <span className='text-[14px] text-[#FF0000]'>{errors.lastName.message}</span>}

                <div className='flex gap-4 w-full m-0 p-0'>
                    <div className='flex flex-col md:w-[260px] w-[180px] h-[100] flex flex-col justify-between'>
                        <label htmlFor="gender" className={`${styles.label}`}>Género:</label>
                        <select id="gender" role='label' aria-label='gender' {...register('gender')}  className="block w-full h-[36px] rounded-[8px] bg-primary border-0 text-gray-600 shadow-md shadow-accent/10 text-[16px] py-0 focus:ring-accent/50 focus:border-accent">
                            <option >- seleccionar -</option>
                            <option value="Femenino">femenino</option>
                            <option value="Masculino">masculino</option>
                            <option value="NoBinario">no binario</option>
                            <option value="PrefieroNoDecir">prefiero no decir</option>
                        </select>
                    </div>

                    <div className='w-full flex flex-col'>
                        <label htmlFor="phone-number" role='label' aria-label='phone' className={`${styles.label}`}>Núm. de teléfono:</label>
                        <input
                            {...register('phoneNumber')}
                            type="text"
                            aria-label='phone'
                            className={`${styles.input}`} />
                        
                        {errors.phoneNumber && <span className='text-[14px] text-[#FF0000] flex justify-end'>{errors.phoneNumber.message}</span>}
                    </div>
                </div>

                <label htmlFor="email" role='label' aria-label='email' className={`${styles.label}`}>Correo:</label>
                <input
                    {...register('email')}
                    type="email"
                    aria-label='email'
                    className={`${styles.input}`} />
                {errors.email && <span className='text-[14px] text-[#FF0000]'>{errors.email.message}</span>}

                <label htmlFor="password" role='label' aria-label='password' className={`${styles.label}`}>Contraseña:</label>
                <input
                    {...register('password')}
                    type="password"
                    role="passwordI"
                    aria-label='passwordI'
                    className={`${styles.input}`} />
                {errors.password && <span className='text-[14px] text-[#FF0000]'>{errors.password.message}</span>}
            
                <label htmlFor="password-confirmed" className={`${styles.label}`}>Confirmar contraseña:</label>
                <input
                    type="password"
                    role="passwordI"
                    aria-label='confirmPassword'
                    {...register('confirmPassword')}
                    className={`${styles.input}`} />
                {errors.confirmPassword && <span className='text-[14px] text-[#FF0000]'>{errors.confirmPassword.message}</span>}
                
                <TermsAndConditions />
                
                <div className="py-[16px]">
                    <SignUpButton disabled={isSubmitting} onSubmit={handleSubmit(onSubmit)} />
                </div>
            </form>
            <SpinerModal isVisible={isLoading}/>
        </>
    )
}

export default SignUpForm;