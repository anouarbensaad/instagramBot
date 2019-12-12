
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


CREATE TABLE `commented_list` (
  `comment_id` varchar(30) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `full_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_private` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tagged_person` varchar(50) NOT NULL,
  `taggedby` varchar(50) NOT NULL,
  `comment_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `caption` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `source_user_media` varchar(50) NOT NULL,
  `Source_Media_url` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8;

-- --------------------------------------------------------

--
-- Table structure for table `feed`
--

CREATE TABLE `feed` (
  `media_id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `likecount` varchar(5) NOT NULL,
  `comment_count` varchar(5) NOT NULL,
  `categorie` varchar(100) NOT NULL,
  `status` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8;

-- --------------------------------------------------------

--
-- Table structure for table `follow`
--

CREATE TABLE `follow` (
  `user_id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `source_id` varchar(50) NOT NULL,
  `categorie` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8;

-- --------------------------------------------------------

--
-- Table structure for table `following_tounf`
--

CREATE TABLE `following_tounf` (
  `user_id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `is_private` varchar(20) NOT NULL,
  `source_id` varchar(50) NOT NULL,
  `categorie` varchar(100) NOT NULL,
  `status` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8;

-- --------------------------------------------------------

--
-- Table structure for table `ig_accounts`
--

CREATE TABLE `ig_accounts` (
  `login` varchar(30) NOT NULL,
  `passwd` varchar(30) NOT NULL,
  `insta_cookies` varchar(500) NOT NULL,
  `insta_csrftoken` varchar(150) NOT NULL,
  `insta_user_id` varchar(100) NOT NULL,
  `android_ver` varchar(250) NOT NULL,
  `Name` varchar(80) NOT NULL,
  `profilepic` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8;

-- --------------------------------------------------------

--
-- Table structure for table `liked_list`
--

CREATE TABLE `liked_list` (
  `user_id` varchar(50) NOT NULL,
  `username` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `full_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_private` varchar(8) NOT NULL,
  `profile_pic_url` varchar(200) NOT NULL,
  `source_liker` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8;

-- --------------------------------------------------------

--
-- Table structure for table `postLike`
--

CREATE TABLE `postLike` (
  `media_id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8;

-- --------------------------------------------------------

--
-- Table structure for table `unfollow`
--

CREATE TABLE `unfollow` (
  `user_id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `source_id` varchar(50) NOT NULL,
  `categorie` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commented_list`
--
ALTER TABLE `commented_list`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `feed`
--
ALTER TABLE `feed`
  ADD PRIMARY KEY (`media_id`);

--
-- Indexes for table `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `following_tounf`
--
ALTER TABLE `following_tounf`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `ig_accounts`
--
ALTER TABLE `ig_accounts`
  ADD PRIMARY KEY (`login`);

--
-- Indexes for table `liked_list`
--
ALTER TABLE `liked_list`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `postLike`
--
ALTER TABLE `postLike`
  ADD PRIMARY KEY (`media_id`);

--
-- Indexes for table `unfollow`
--
ALTER TABLE `unfollow`
  ADD PRIMARY KEY (`user_id`);


