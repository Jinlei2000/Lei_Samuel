<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center bg-gray-900">
    <div class="w-2/3 text-white text-center">
      <h1 class="text-9xl animate__animated animate__fadeInDown"><code>Access Denied</code></h1>
      <hr class="border-white animate__animated animate__fadeInLeft mx-auto my-8" style="width: 50%;" />
      <h3 class="animate__animated animate__fadeInRight">You don't have permission to view this site.</h3>
      <h3 class="animate__animated animate__zoomIn">🚫🚫🚫🚫</h3>
      <h6 class="animate__animated animate__zoomIn">Error Code: 403 Forbidden</h6>
      <router-link to="/" class="mt-8 text-blue-500 hover:underline animate__animated animate__zoomIn">
        Back to Home
      </router-link>
    </div>
  </div>
</template>
