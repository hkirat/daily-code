'use client'

import { CheckIcon, Cross1Icon, Pencil1Icon } from '@radix-ui/react-icons'
import { Button, Input, Label, useToast } from '@repo/ui'
import React, { FormEvent, useState } from 'react'
import { updateUserName } from './utils'
import { useRouter } from 'next/navigation'

export const EditUserName = ({ userName, userId }: { userName: string, userId: string }) => {
    const router = useRouter();
    const {toast} = useToast();
    const [isDisable, setIsDisable] = useState<boolean>(true);
    const [nameInput, setNameInput] = useState<string>('');
    const clickHandler = (e: FormEvent) => {
        e.preventDefault();
        setIsDisable(!isDisable)
    }
    const updateHandler = async(e: FormEvent)=>{
        e.preventDefault();
        try {
            const res = await updateUserName(userId, nameInput);
            if(res.id){
                toast({
                    description: 'Your name has been updated'
                })
            }
            router.refresh();
        } catch (error) {
            toast({
                description: 'Failed to update name, try again'
            })
        }
        setIsDisable(!isDisable)
    }

    return (
        <>
            <div>
                <div className="flex gap-1 items-center">
                    <Label className="">Your name</Label>
                    {isDisable ? (<Button variant='ghost' onClick={clickHandler}>
                        <Pencil1Icon />
                    </Button>) : (
                        <div className="flex gap-1 items-center">
                            <Button variant='ghost' onClick={updateHandler}>
                                <CheckIcon />
                            </Button>
                            <Button variant='ghost' onClick={clickHandler}>
                                <Cross1Icon />
                            </Button>
                        </div>
                    )}
                </div>
                <Input disabled={isDisable} placeholder="Enter your name" value={isDisable ? userName : nameInput} className="p-2 mt-2" onChange={(e)=>{setNameInput(e.target.value)}} />
            </div>
        </>
    )
}
