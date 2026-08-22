# React Native & Expo ProGuard rules

# Audio and Media3 / ExoPlayer (CRITICAL FOR EXPO-AV + EXPO-AUDIO SOUND PLAYBACK)
-keep class expo.modules.av.** { *; }
-keep class expo.modules.audio.** { *; }
-keep class expo.modules.notifications.** { *; }
-keep class com.google.android.exoplayer2.** { *; }
-keep class androidx.media3.** { *; }
-keep class android.media.** { *; }
-dontwarn com.google.android.exoplayer2.**
-dontwarn androidx.media3.**

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native & Hermes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Expo Modules
-keep class expo.modules.** { *; }
-keep class host.exp.exponent.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep annotations
-keepattributes *Annotation*,InnerClasses,EnclosingMethod,Signature
-dontwarn javax.annotation.**
-dontwarn okio.**
-dontwarn okhttp3.**
