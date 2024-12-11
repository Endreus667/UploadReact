"use client"

import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useDropzone } from "react-dropzone";

export const Form = () => {
    const [selectedFile, setSelectFile] = useState<File | undefined>(undefined);
    const [legendField, setLegendField] = useState('');
    const [progressUpload, setProgressUpload] = useState(0);
    const [preview, setPreview] = useState<string | null>(null); // Para armazenar a URL da pré-visualização da imagem
    const [error, setError] = useState<string | null>(null); // Para armazenar mensagens de erro

    // Configuração do react-dropzone
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                const file = acceptedFiles[0];

                // Verifica se o arquivo é uma imagem
                if (file.type.startsWith("image/")) {
                    setSelectFile(file);
                    setError(null); // Limpa mensagens de erro
                    setPreview(URL.createObjectURL(file)); // Exibe a pré-visualização da imagem
                } else {
                    setError("Por favor, selecione uma imagem."); // Mensagem de erro caso o arquivo não seja uma imagem
                }
            }
        }
    });

    // Manipulador de arquivo
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Verifica se o arquivo é uma imagem
            if (file.type.startsWith("image/")) {
                setSelectFile(file);
                setError(null); // Limpa mensagens de erro
                setPreview(URL.createObjectURL(file)); // Exibe a pré-visualização da imagem
            } else {
                setError("Por favor, selecione uma imagem.");
                setPreview(null); // Limpa a pré-visualização se não for imagem
            }
        }
    }

    // Envio do formulário
    const handleSubmit = async () => {
        if (selectedFile) {
            if (legendField.trim() === "") {
                setError("A legenda não pode estar vazia.");
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('legend', legendField);

            const url = 'https://b7web.com.br/uploadtest/';
            try {
                const req = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const porcentagem = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                            setProgressUpload(porcentagem); // Atualiza o progresso
                        }
                    }
                });
                console.log(req.data); // Exibir resposta da API
                setPreview(null); // Limpa a pré-visualização após o envio
            } catch (error) {
                console.error('Erro ao enviar o arquivo:', error); // Tratamento de erro
                setError('Erro ao enviar o arquivo. Tente novamente.');
            }
        } else {
            setError('Nenhum arquivo selecionado.');
        }
    }

    return (
        <div>
           {/* Área de arraste e solte arquivo */}
            <div className="bg-gray-200 h-48 p-3" {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="text-black">Arraste e solte seu arquivo aqui ou clique para selecionar</p>
            </div>
            {/* Input para selecionar o arquivo */}
            <input
                className="block my-3"
                type="file"
                onChange={handleFileChange}
            />

            {/* Exibição da pré-visualização do arquivo (se for imagem) */}
            {preview && (
                <div className="my-3">
                    <h3>Pré-visualização:</h3>
                    <img src={preview} alt="Pré-visualização" className="max-w-xs" />
                </div>
            )}

            {/* Campo para a legenda */}
            <input
                type="text"
                className="block my-3"
                placeholder="Digite uma legenda"
                value={legendField}
                onChange={e => setLegendField(e.target.value)}
            />

            {/* Exibição da mensagem de erro */}
            {error && (
                <div className="text-red-500 my-2">{error}</div>
            )}

            {/* Botão de Enviar */}
            <button
                className="block my-3"
                onClick={handleSubmit}
            >
                Enviar
            </button>

            {/* Barra de Progresso */}
            <div className="w-[300px] bg-gray-200 h-2 mt-4 mx-auto">
                <div
                    className="bg-green-500 h-full"
                    style={{ width: `${progressUpload}%` }}
                ></div>
            </div>

            {/* Exibição da porcentagem */}
            <div className="mt-2 text-center">
                {progressUpload}% Completo
            </div>
        </div>
    )
}

export default Form;
