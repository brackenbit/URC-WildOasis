/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Example component had some issues with unnecessary complexity and poor UX.
    Rewritten to:
    - use react-hook-forms
    - update multiple settings at once
    - only call API when needed
    - use transient props (to avoid invalid parameters leaking onto the DOM).
*/

import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useUpdateSettings } from "./useUpdateSettings";
import { useEffect } from "react";

export default function SettingsForm({ settings }) {
    const {
        register,
        handleSubmit: RHFhandleSubmit,
        getValues,
        reset,
        formState,
    } = useForm({
        // Async 'settings' handled in parent wrapper component.
        // By the time we get here, we can treat it as synchronous.
        defaultValues: { ...settings },
    });
    const { errors } = formState;
    const hasChanges = formState.isDirty;

    // react-hook-forms caches defaultValues on initial render,
    // and won't update when the settings prop changes, unless we do this:
    useEffect(() => {
        reset(settings);
    }, [settings, reset]);

    const { isUpdating, updateSettings } = useUpdateSettings();

    function handleSubmit(data) {
        if (!hasChanges) return;

        // Make a new object containing only the updated settings
        // Get an array of keys for updated fields:
        const updatedFields = Object.keys(formState.dirtyFields);
        // Then use reduce to build a new object containing those parameters from data:
        const updatedSettings = updatedFields.reduce((object, key) => {
            object[key] = data[key];
            return object;
        }, {});

        updateSettings(updatedSettings);
    }

    return (
        <Form onSubmit={RHFhandleSubmit(handleSubmit)}>
            <FormRow
                label="Minimum nights/booking"
                error={errors?.minBookingLength?.message}
            >
                <Input
                    type="number"
                    id="minBookingLength"
                    disabled={isUpdating}
                    {...register("minBookingLength", {
                        // valueAsNumber is required for RHF's 'isDirty' to work
                        // (Otherwise numbers are returned as strings, and never match defaultValues.)
                        valueAsNumber: true,
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Min nights must be at least 1",
                        },
                    })}
                />
            </FormRow>
            <FormRow
                label="Maximum nights/booking"
                error={errors?.maxBookingLength?.message}
            >
                <Input
                    type="number"
                    id="maxBookingLength"
                    disabled={isUpdating}
                    {...register("maxBookingLength", {
                        valueAsNumber: true,
                        required: "This field is required",
                        validate: (value) =>
                            +value >= +getValues().minBookingLength ||
                            "Maximum booking length must be >= minimum booking length",
                    })}
                />
            </FormRow>
            <FormRow
                label="Maximum guests/booking"
                error={errors?.maxGuestsPerBooking?.message}
            >
                <Input
                    type="number"
                    id="maxGuestsPerBooking"
                    disabled={isUpdating}
                    {...register("maxGuestsPerBooking", {
                        valueAsNumber: true,
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Max guests must be at least 1",
                        },
                    })}
                />
            </FormRow>
            <FormRow
                label="Breakfast price"
                error={errors?.breakfastPrice?.message}
            >
                <Input
                    type="number"
                    id="breakfastPrice"
                    disabled={isUpdating}
                    {...register("breakfastPrice", {
                        valueAsNumber: true,
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow>
                <Button
                    $variation="secondary"
                    disabled={isUpdating}
                    onClick={() => reset(settings)}
                >
                    Cancel
                </Button>
                <Button
                    $variation={hasChanges ? "primary" : "secondary"}
                    disabled={isUpdating || !hasChanges}
                >
                    Update settings
                </Button>
            </FormRow>
        </Form>
    );
}
