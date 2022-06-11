<template>
  <div class="input flex flex-column">
    <label :for="id">{{ label }}</label>
    <input
      required
      type="text"
      :disabled="disabled"
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "FormInputText",
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    modelValue: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.input {
  margin-bottom: 24px;
}
label {
  font-size: 12px;
  margin-bottom: 6px;
}
input {
  width: 100%;
  background-color: #1e2139;
  color: #fff;
  border-radius: 4px;
  padding: 12px 4px;
  border: none;
  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: #545774;
    cursor: not-allowed;
  }
}
</style>
