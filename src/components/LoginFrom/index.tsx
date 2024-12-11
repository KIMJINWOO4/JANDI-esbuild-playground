import React, {useState, useRef} from 'react';
import {
    TextInput,
    TouchableOpacity,
} from 'react-native';

import {Box} from '@/components/ui/box'
import {VStack} from '@/components/ui/vstack'
import {HStack} from '@/components/ui/hstack'
import {Text} from '@/components/ui/text'

import {useNavigation} from '@react-navigation/native';
import {useSetRecoilState} from 'recoil';
import authState from '../../recoil/authAtom';
import handleLogin from '../../api/login/LoginApi';
import {setItem} from '../../api/asyncStorage';
import {useMutation} from '@tanstack/react-query';

import {LoginFormStyles} from './../LoginFrom/LoginFromStyle.ts';
import {LoginPropsType} from "@/src/api/login/LoginPropsType.ts";

import {LoginFormProps} from "@/src/components/types/LoginFormType/LoinFromType.ts";


const LoginForm:React.FC<LoginFormProps> = ({setIsLoading}) => {
    const navigation = useNavigation();
    const setAuthState = useSetRecoilState(authState);
    const [isAutoLogin, setIsAutoLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const passwordInputRef = useRef(null);

    const mutation = useMutation({
        mutationFn: ({email, password}: LoginPropsType) =>
            handleLogin({email, password}),
    });

    const onLoginPress = async () => {
        setIsLoading(true);
        try {
            mutation.mutate(
                {
                    email: email,
                    password: password,
                },
                {
                    onSuccess: async data => {
                        console.log(data);
                        const refreshToken = data?.data?.refreshToken;
                        console.log(refreshToken);
                        await setItem('refreshToken', refreshToken);
                        if (isAutoLogin) {
                            await setItem('autoLogin', 'Y');
                        } else {
                            await setItem('autoLogin', '');
                        }
                        const authToken = data.headers['authorization'];
                        setAuthState({email, authToken});
                        navigation.reset({
                            index: 0,
                            routes: [{name: 'Home'}],
                        });
                    },
                    onError: error => {
                        console.log(
                            '오류',
                            error.message || '로그인 중 오류가 발생했습니다.',
                        );
                    },
                },
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box style={LoginFormStyles.loginFormContainer}>
            <VStack style={LoginFormStyles.loginFormInnerContainer}>
                <VStack style={LoginFormStyles.inputContainer}>
                    <Text style={LoginFormStyles.inputLabel}>이메일</Text>
                    <TextInput
                        style={LoginFormStyles.input}
                        placeholder="이메일을 입력해주세요."
                        placeholderTextColor="#B9B9B9"
                        value={email}
                        onChangeText={setEmail}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            passwordInputRef.current?.focus();
                        }}
                        blurOnSubmit={false}
                    />
                </VStack>
                <VStack style={LoginFormStyles.inputContainer}>
                    <Text style={LoginFormStyles.inputLabel}>비밀번호</Text>
                    <TextInput
                        style={LoginFormStyles.input}
                        placeholder="비밀번호를 입력해주세요."
                        placeholderTextColor="#B9B9B9"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        ref={passwordInputRef}
                        returnKeyType="done"
                        onSubmitEditing={onLoginPress}
                    />
                    <TouchableOpacity
                        style={LoginFormStyles.findTextContainer}
                        onPress={() =>
                            navigation.navigate('FindPassword', {
                                title: '비밀번호 찾기',
                            })
                        }>
                        <Text style={LoginFormStyles.findText}>비밀번호 찾기</Text>
                    </TouchableOpacity>

                    <HStack style={LoginFormStyles.autoLoginContainer}>
                        <TouchableOpacity
                            style={LoginFormStyles.customCheckboxContainer}
                            onPress={() => setIsAutoLogin(!isAutoLogin)}>
                            <Box
                                style={[
                                    LoginFormStyles.customCheckbox,
                                    isAutoLogin && LoginFormStyles.customCheckboxChecked,
                                ]}>
                                {isAutoLogin && <Text style={LoginFormStyles.checkmark}>✓</Text>}
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsAutoLogin(!isAutoLogin)}>
                            <Text style={LoginFormStyles.optionText}>자동 로그인</Text>
                        </TouchableOpacity>
                    </HStack>
                </VStack>

                <TouchableOpacity
                    style={LoginFormStyles.loginButton}
                    onPress={() => onLoginPress()}>
                    <Text style={LoginFormStyles.loginButtonText}>잔디 심기</Text>
                </TouchableOpacity>
            </VStack>
        </Box>
    );
};

export default LoginForm;

