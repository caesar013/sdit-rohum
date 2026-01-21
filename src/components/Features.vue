<script setup>
const features = [
  {
    title: 'Islamic Excellence',
    description: 'Comprehensive Islamic education integrated with modern curriculum',
    icon: '📖'
  },
  {
    title: 'Expert Teachers',
    description: 'Dedicated and qualified educators committed to student success',
    icon: '👨‍🏫'
  },
  {
    title: 'Modern Facilities',
    description: 'State-of-the-art classrooms and learning environments',
    icon: '🏫'
  },
  {
    title: 'Character Building',
    description: 'Focus on moral development and strong ethical values',
    icon: '⭐'
  },
  {
    title: 'Safe Environment',
    description: 'Secure campus with caring and supportive atmosphere',
    icon: '🛡️'
  },
  {
    title: 'Holistic Development',
    description: 'Academic, spiritual, and social growth for every child',
    icon: '🌱'
  }
]
</script>

<template>
  <section class="py-20 px-4 bg-light-gray">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-neutral-900 mb-4">
          Why Choose Noble Elementary?
        </h2>
        <p class="text-xl text-neutral-600 max-w-2xl mx-auto">
          Discover what makes us the trusted choice for families seeking excellence in education
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div class="text-5xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-bold text-neutral-900 mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-neutral-600">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
