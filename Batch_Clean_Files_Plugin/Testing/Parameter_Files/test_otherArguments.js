let test_otherArguments =
{
    handbrakePath: 'C:/app/HandBrakeCLI.exe',
    ffmpegPath: 'C:/app/ffmpeg.exe',
    mkvpropeditPath: 'C:/app/mkvpropedit.exe',
    originalLibraryFile: '', // data of the original file before being processed.
    nodeHardwareType: 'nvenc', // Node hardware type from UI option on Node options panel.
    pluginCycle: 2,
    workerType: 'transcodegpu',
    version: '2.00.20',
    platform_arch_isdocker: 'win32_x64_docker_false',
    cacheFilePath: 'C:/Transcode/Cache Folder/qsv_h264-TdarrCacheFile-1FSl77HmK.mkv' // suggested cache file path if using custom transcode settings
};

const _test_otherArguments = test_otherArguments;
export { _test_otherArguments as test_otherArguments };