<template>
  <div class="input flex flex-column">
    <label :for="id">{{ label }}</label>
    <select
      required
      type="text"
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "FormInputSelect",
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
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
select {
  width: 100%;
  background-color: #1e2139;
  color: #fff;
  border-radius: 4px;
  padding: 12px 4px;
  border: none;
  &:focus {
    outline: none;
  }
}
</style>
