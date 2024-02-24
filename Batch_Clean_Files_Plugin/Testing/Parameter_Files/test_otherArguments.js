function test_otherArguments() {
    return otherArguments =
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
        cacheFilePath: 'E:/Dev/Tdarr_Plugins/Batch_Clean_Files_Plugin/Testing/Mock_Folder_Structure/tdarr/tdarr_cache/RandomlyGenNamedFolder/Log Horizon (2013) - S02E05 - 030 - Christmas Eve [Bluray-1080p][10bit][x264][FLAC 2.0][EN+JA]-CTR.mkv'
    };
}

module.exports.test_otherArguments = test_otherArguments;