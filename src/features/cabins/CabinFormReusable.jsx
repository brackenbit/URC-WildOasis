/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    New component providing a reusable form, wrapped by add/edit cabin components.
*/

import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";

export default function CabinFormReusable({
    onSubmit: onSubmitOuter,
    isWorking,
    editValues = {},
    onCloseModal,
}) {
    const { register, handleSubmit, reset, getValues, formState } = useForm({
        defaultValues: editValues,
    });
    const { errors } = formState;
    const hasChanges = formState.isDirty;

    // Derive isEditSession from whether editValues is empty
    const isEditSession = !(Object.keys(editValues).length === 0);

    function customHandleSubmit(data) {
        // customHandleSubmit sits between react-hook-form's handleSubmit and the
        // onSubmit provided by parent,
        // to submit only when changes are made and close the modal
        if (!hasChanges) return;

        onSubmitOuter(data);
        onCloseModal?.();
    }

    function handleCancel(e) {
        e.preventDefault();

        if (isEditSession) {
            reset(editValues);
        } else {
            onCloseModal();
        }
    }

    return (
        <Form onSubmit={handleSubmit(customHandleSubmit)} type="modal">
            <FormRow label="Cabin name" error={errors?.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isWorking}
                    {...register("name", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label="Maximum capacity"
                error={errors?.maxCapacity?.message}
            >
                <Input
                    type="number"
                    id="maxCapacity"
                    disabled={isWorking}
                    {...register("maxCapacity", {
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Capacity should be at least 1",
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label="Regular price"
                error={errors?.regularPrice?.message}
            >
                <Input
                    type="number"
                    id="regularPrice"
                    disabled={isWorking}
                    {...register("regularPrice", {
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Price should be at least 1",
                        },
                    })}
                />
            </FormRow>

            <FormRow label="Discount" error={errors?.discount?.message}>
                <Input
                    type="number"
                    id="discount"
                    disabled={isWorking}
                    defaultValue={0}
                    {...register("discount", {
                        required: "This field is required",
                        // Custom validation function can be written with callback
                        // If function returns true, data is validated
                        validate: (value) =>
                            +value <= +getValues().regularPrice ||
                            "Discount should be less than the regular price",
                    })}
                />
            </FormRow>

            <FormRow
                label="Description for website"
                error={errors?.description?.message}
            >
                <Textarea
                    type="number"
                    id="description"
                    disabled={isWorking}
                    defaultValue=""
                    {...register("description", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow label="Cabin photo" error={errors?.image?.message}>
                <FileInput
                    id="image"
                    accept="image/*"
                    type="file"
                    disabled={isWorking}
                    {...register("image", {
                        required: isEditSession
                            ? false
                            : "This field is required",
                    })}
                />
            </FormRow>

            <FormRow>
                <Button $variation="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button disabled={isWorking || !hasChanges}>
                    {isEditSession ? "Edit" : "Create new"} cabin
                </Button>
            </FormRow>
        </Form>
    );
}
